var async = require('async'),
   keystone = require('keystone'),
   restUtils = require('./restUtils'),
   express = require('express'),
   router = express.Router();

var PrayerResponse = keystone.list('PrayerResponse');
var model = PrayerResponse.model;

var reqModel = keystone.list('PrayerRequest').model;
var leaderAPIKey = process.env.LEADER_API_KEY;

router.route('/')
   .post(function(req, res, next) {
      reqModel.findById(req.body.prayerRequestId).select('-fcm_id').exec(function(err, prayerrequest) {
         if (err) return res.status(400).send(err);
         if (!prayerrequest) return res.status(400).send(prayerrequest);
         if (prayerrequest.leadersOnly && req.query.LeaderAPIKey != leaderAPIKey) {
            return res.status(403).send('not authorized');
         }
         model.create(req.body, function(err, prayerresponse) {
            if (err) return res.status(400).send(err);
            prayerrequest.prayerResponse.push(prayerresponse.id);
            prayerrequest.save();
            return res.status(201).json(prayerresponse);
         });
      });
   });

module.exports = router;