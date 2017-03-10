var async = require('async'),
	keystone = require('keystone'),
	restUtils = require('./restUtils'),
	express = require('express'),
	router = express.Router();

var User = keystone.list("User");
var Passenger = keystone.list("Passenger");
var Ride = keystone.list("Ride");

router.route('/')
	.post(function(req, res, next) {
		User.model.update({gcmId: req.body.old}, {gcmId: req.body.new}, null, function(err, numAffected) {
			if (err)
            return res.status(400).send(err);
			else {
				Ride.model.update({gcm_id: req.body.old}, {gcm_id: req.body.new}, null, function(err, numAffected) {
					if (err)
                  return res.status(400).send(err);
					else {
						Passenger.model.update({gcm_id: req.body.old}, {gcm_id: req.body.new}, null, function(err, numAffected) {
							if(err)
                        return res.status(400).send(err);
							else
                        return res.status(200).send({success: true});
						})
					}
				})
			}
		})
	});
module.exports = router;
