var async = require('async'),
   keystone = require('keystone'),
   restUtils = require('./restUtils'),
   express = require('express'),
   router = express.Router();

var User = keystone.list("User");
var Passenger = keystone.list("Passenger");
var Ride = keystone.list("Ride");
var PrayerRequest = keystone.list("PrayerRequest");
var PrayerResponse = keystone.list("PrayerResponse");

router.route('/').post(function(req, res, next) {
      User.model.update({fcmId: req.body.old}, {fcmId: req.body.new}, null, function(err, numAffected) {
         if(err) return res.status(400).send(err);
         else {
            Ride.model.update({fcm_id: req.body.old}, {fcm_id: req.body.new}, null, function(err, numAffected) {
               if(err) return res.status(400).send(err);
					else {
                  Passenger.model.update({fcm_id: req.body.old}, {fcm_id: req.body.new}, null, function(err, numAffected) {
                     if(err) return res.status(400).send(err);
                     else {
                        PrayerRequest.model.update({fcm_id: req.body.old}, {fcm_id: req.body.new}, null, function(err, numAffected) {
                           if(err) return res.status(400).send(err);
                           else {
                              PrayerResponse.model.update({fcm_id: req.body.old}, {fcm_id: req.body.new}, null, function(err, numAffected) {
                                 if(err) return res.status(400).send(err);
                                 else
                                    return res.status(200).send({success: true});
                              })
                           }
                        })
                     }  
                  })
               }
            })
         }
      })
   });
module.exports = router;
