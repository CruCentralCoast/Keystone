var async = require('async'),
   keystone = require('keystone'),
   restUtils = require('./restUtils'),
   express = require('express'),
   router = express.Router();

var PrayerRequest = keystone.list('PrayerRequest');
var model = PrayerRequest.model;

var leaderAPIKey = process.env.LEADER_API_KEY;

router.route('/')
   .get(function(req, res) {
      var params = {};
      var isLeader = req.query.LeaderAPIKey == leaderAPIKey;
      if (!isLeader) {
         params = {'leadersOnly': {'$ne':true}};
      }
      model.find(params).select('-fcm_id').sort({createdAt: 'descending'}).exec(function(err, items) {
         if (err) return res.send(err);
         var length = items.length;
         for (var i = 0; i < length; i++) {
            var item = items[i].toObject();
            item.prayerResponseCount = item.prayerResponse.length;
            delete item.prayerResponse;
            if (!isLeader) {
               delete item.genderPreference;
               delete item.contact;
               delete item.contactLeader;
               delete item.contacted;
               delete item.contactEmail;
               delete item.contactPhone;
            }
            items[i] = item;
         }
         return res.json(items);
      });
   })
   .post(function(req, res, next) {
      restUtils.create(model, req, res);
   });

router.route('/fcm_id')
   .get(function(req, res, next) {
      var params = {'fcm_id': req.query.fcm_id};
      model.find(params).select('-fcm_id').sort({createdAt: 'descending'}).exec(function(err, items) {
         if (err) return res.send(err);
         return res.json(items);
      });
   });

router.route('/:id')
   .get(function(req, res, next) {
      model.findById(req.params.id).populate('prayerResponse', '-fcm_id').exec(function(err, item) {
         if (err) return res.status(400).send(err);
         if (!item) return res.status(400).send(item);
         var isLeader = req.query.LeaderAPIKey && req.query.LeaderAPIKey == leaderAPIKey;
         var isAuthor = req.query.fcm_id && req.query.fcm_id == item.fcm_id;
         if (item.leadersOnly && !isLeader && !isAuthor) {
            return res.status(403).send('not authorized');
         }
         item = item.toObject();
         delete item.fcm_id;
         if (!isLeader) {
            delete item.genderPreference;
            delete item.contact;
            delete item.contactLeader;
            delete item.contacted;
            delete item.contactEmail;
            delete item.contactPhone;
         }
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