var async = require('async'),
	keystone = require('keystone'),
    gcm = require('node-gcm'),
    restUtils = require('./restUtils'),
    gcmUtils = require('./gcmUtils'),
	express = require('express'),
	router = express.Router();

var notifications = require("./notificationUtils");

var model = keystone.list("Ride").model;

var gcmAPIKey = process.env.GCM_API_KEY;

var notificationTitle = "Cru Ride Sharing";

router.route('/')
	.get(function(req, res, next) {
		restUtils.list(model, req, res);
	})
	.post(function(req, res, next) {
		restUtils.create(model, req, res);
	});

router.route('/:id')
	.get(function(req, res, next) {
		restUtils.get(model, req, res);
	})
	.patch(function(req, res, next) {
		restUtils.update(model, req, res);
	})
	.delete(function(req, res) {
		model.findOne().where("_id", req.params.id).populate("passengers").populate("event").exec(function(err, ride) {

			success = true;

            // START: Send Notification to Passengers
			var regTokens = [];
			ride.passengers.forEach(function(passenger) {
				regTokens.push(passenger.gcm_id);
			});

            var message = "You have been dropped from a ride to " + ride.event.name + ".";

            var payload = {}; //TODO: add in payload type and other info (if neccessary)

            regTokens.forEach(function(token) {
                notifications.send(token, notificationTitle, message, payload, function(err, response) {
                    if (err) {
                        console.error(err);
                        success = false;
                    }
                    else {
                        if (!process.env.TESTING)
                            console.log(response);
                    }
                });
            });

			ride.passengers.forEach(function(passenger) {
				passenger.remove();
			});
			ride.remove();
			return res.status(204).json();
		});
	});

router.route('/search')
	.post(function(req, res, next) {
		restUtils.search(model, req, res);
	});

router.route('/enumValues/:key')
	.get(function(req, res, next) {
		restUtils.enumValues(model, req, res);
	});

router.route('/find')
	.post(function(req, res, next) {
		restUtils.find(model, req, res);
	});

router.route('/:id/passengers')
	.post(function(req, res, next) {
		keystone.list("Passenger").model.findOne().where("_id", req.body.passenger_id).exec(function(err, passenger) {
			if (err) return res.send(err);
			if (!passenger) return res.status(400).send();
			model.findOne().where("_id", req.params.id).populate("event").exec(function(err, ride) {
				if (ride.passengers.indexOf(req.body.passenger_id) == -1)
					ride.passengers.push(req.body.passenger_id);

				var regTokens = ride.gcm_id;

                var message = "Passenger " + passenger.name + " has been added to your car.";

                var payload = {} // TODO add info for contact cards

                notifications.send(regTokens, ride.event.name, message, payload, function(err, response) {
                    if (err) {
						console.error(err);
						success = false;
					}
					else {
                        if(!process.env.TESTING)
                            console.log(response);
					}
                });

                passenger.set({ has_driver: true });
                passenger.save();

				ride.save();
				return res.status(200).json(ride);
			});
		});
	});

router.route('/:id/passengers/:passenger_id')
	.delete(function(req, res) {
		keystone.list("Passenger").model.findOne().where("_id", req.params.passenger_id).exec(function(err, passenger) {
			model.findOne().where("_id", req.params.id).populate("event").exec(function(err, ride) {
				var index = ride.passengers.indexOf(req.params.passenger_id);
				ride.passengers.splice(index, 1);

                async.series([function(cb) {
                        // START: Send Notification to Driver
                        var regTokens = ride.gcm_id;
                        var message = "Passenger " + passenger.name + " has been dropped from your car.";
                        var payload = {}; // TODO I don't think this needs a payload, but who knows
                        notifications.send(regTokens, ride.event.name, message, payload, function(err, response) {
                            if (err) {
                                console.error(err);
                                success = false;
                            }
                            else {
                                if(!process.env.TESTING)
                                    console.log(response);
                            }
                            cb();
                        });
                        // END: Send Notification to Driver
                    }, function(cb) {
                        // START: Send Notification to Passenger
                        var regTokens = passenger.gcm_id;
                        var message = "You have been dropped from a ride to " + ride.event.name + ".";
                        var payload = {}; //TODO once again i don't THINK this needs anything else
                        notifications.send(regTokens, notificationTitle, message, payload, function(err, response) {
                            if (err) {
                                console.error(err);
                                success = false;
                            }
                            else {
                                if(!process.env.TESTING)
                                    console.log(response);
                            }
                            cb();
                        });
                        // END: Send Notification to Passenger
                    }]);
				passenger.remove();
				ride.save();
				return res.json(ride);
			});
		});
	});


module.exports = router;
