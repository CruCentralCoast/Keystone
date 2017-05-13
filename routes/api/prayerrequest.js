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
      if (req.query.LeaderAPIKey != leaderAPIKey) {
         params = {'leadersOnly': {'$ne':true}};
      }
      model.find(params).select('-fcm_id').sort({createdAt: 'descending'}).exec(function(err, items) {
         if (err) return res.send(err);
         return res.json(items);
      });
   })
   .post(function(req, res, next) {
      restUtils.create(model, req, res);
   });

router.route('/fcm_id')
   .get(function(req, res, next) {
      var params = {'fcm_id': req.query.fcm_id};
      model.find(params).select('-fcm_id').sort({createdAt: 'descending'}).populate('prayerResponse', '-fcm_id').exec(function(err, items) {
         if (err) return res.send(err);
         return res.json(items);
      });
   });

router.route('/:id')
   .get(function(req, res, next) {
      model.findById(req.params.id).select('-fcm_id').populate('prayerResponse', '-fcm_id').exec(function(err, item) {
         if (err) return res.status(400).send(err);
         if (!item) return res.status(400).send(item);
         if (item.leadersOnly && req.query.LeaderAPIKey != leaderAPIKey) {
            return res.status(403).send('not authorized');
         }
         return res.status(200).json(item);
      });
   });

module.exports = router;