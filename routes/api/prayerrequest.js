var async = require('async'),
   keystone = require('keystone'),
   restUtils = require('./restUtils'),
   express = require('express'),
   router = express.Router();

var model = keystone.list('PrayerRequest').model;
var userModel = keystone.list('User').model;
var leaderAPIKey = process.env.LEADER_API_KEY;

router.route('/')
   .get(function(req, res) {
      var params = {};
      var isLeader = req.query.LeaderAPIKey == leaderAPIKey;
      if (!isLeader) {
         //remove leaders only prayer requests if not a leader
         params = { 'leadersOnly': {'$ne':true} };
         getAllPrayerRequests(res, '-fcm_id -genderPreference -contact -contactLeader -contacted -contactEmail -contactPhone', params);
      }
      else {
         //filter out gender preferred prayer requests depending on the gender of the leader
         var removeMale = { 'genderPreference': {'$ne':1} };
         var removeFemale = { 'genderPreference': {'$ne':2} };
         userModel.findById(req.query.userId).exec(function(err, item) {
            if (item) {
               if (item.sex == 1) {
                  removeMale = {};
               }
               else if (item.sex == 2) {
                  removeFemale = {};
               }
            }
            params = { $and: [ removeMale, removeFemale ] };
            getAllPrayerRequests(res, '-fcm_id', params);
         });
      }
   })
   .post(function(req, res, next) {
      restUtils.create(model, req, res);
   });

function getAllPrayerRequests(res, fields, params) {
   model.find(params).select(fields).sort({createdAt: 'descending'}).exec(function(err, items) {
      if (err) return res.send(err);
      items = formatPrayerResponses(items);
      return res.json(items);
   });
}

function formatPrayerResponses(items) {
   var length = items.length;
   for (var i = 0; i < length; i++) {
      var item = items[i].toObject();
      item.prayerResponseCount = item.prayerResponse.length;
      delete item.prayerResponse;
      items[i] = item;
   }
   return items;
}

router.route('/fcm_id')
   .get(function(req, res, next) {
      var params = {'fcm_id': req.query.fcm_id};
      model.find(params).select('-fcm_id').sort({createdAt: 'descending'}).exec(function(err, items) {
         if (err) return res.send(err);
         items = formatPrayerResponses(items);
         return res.json(items);
      });
   });

router.route('/:id')
   .get(function(req, res, next) {
      var isLeader = req.query.LeaderAPIKey && req.query.LeaderAPIKey == leaderAPIKey;
      model.findById(req.params.id).select(isLeader ? '' : '-genderPreference -contact -contactLeader -contacted -contactEmail -contactPhone').populate('prayerResponse', '-fcm_id').exec(function(err, item) {
         if (err) return res.status(400).send(err);
         if (!item) return res.status(400).send(item);
         var isAuthor = req.query.fcm_id && req.query.fcm_id == item.fcm_id;
         if (item.leadersOnly && !isLeader && !isAuthor) {
            return res.status(403).send('not authorized');
         }
         item = item.toObject();
         delete item.fcm_id;
         return res.status(200).json(item);
      });
   })
   .patch(function(req, res, next) {
      var isLeader = req.body.LeaderAPIKey == leaderAPIKey;
      if (isLeader) {
         restUtils.update(model, req, res);
      }
      else {
         return res.status(403).send('not authorized');
      }
   });

module.exports = router;