var async = require('async'),
    keystone = require('keystone'),
    restUtils = require('./restUtils'),
    express = require('express'),
    router = express.Router();

var notifications = require("./notificationUtils");
var fcmUtils = require("./fcmUtils");

var model = keystone.list("Ride").model;

var notificationTitle = "Cru Ride Sharing";

router.route('/')
    .get(function (req, res) {
        restUtils.list(model, req, res);
    })
    .post(function (req, res) {
        restUtils.create(model, req, res);
    });

router.route('/:id')
    .get(function (req, res) {
        restUtils.get(model, req, res);
    })
    .patch(function (req, res) {
        restUtils.update(model, req, res);
    })
    .delete(function (req, res) {
        model.findOne().where("_id", req.params.id).populate("passengers").populate("event").exec(function (err, ride) {

            // START: Send Notification to Passengers
            var fcmTokens = [];
            /*ride.passengers.forEach(function (passenger) {
                fcmTokens.push({
                    id: passenger.fcmId,
                    device: passenger.deviceType
                });
            });*/

            var message = "You have been dropped from a ride to " + ride.event.name + ".";

            notifications.sendToDevice(fcmTokens, notificationTitle, message, "", function (err) {
                if (err) {
                    res.send(err);
                }
            });

            ride.passengers.forEach(function (passenger) {
                passenger.remove();
            });
            ride.remove();
            //return res.status(204).json();
            return res.status(200).send({Warning: "Push Notifications disabled until Passengers are set up to be registered users"});
        });
    });

router.route('/search')
    .post(function (req, res) {
        model.find(req.body.conditions, req.body.projection, req.body.options, function (err, rides) {
            if (err) return res.send(err);

            var filteredRides = rides.filter(function (ride) {
                return ride.passengers.length < ride.seats;
            });
            return res.json(filteredRides);
        });
    });

router.route('/enumValues/:key')
    .get(function (req, res) {
        restUtils.enumValues(model, req, res);
    });

router.route('/find')
    .post(function (req, res) {
        restUtils.find(model, req, res);
    });

router.route('/:id/passengers')
    .post(function (req, res) {
        keystone.list("Passenger").model.findOne().where("_id", req.body.passenger_id).exec(function (err, passenger) {
            if (err) return res.send(err);
            if (!passenger) return res.status(400).send();
            model.findOne().where("_id", req.params.id).populate("event").exec(function (err, ride) {
                if (ride.passengers.indexOf(req.body.passenger_id) == -1)
                    ride.passengers.push(req.body.passenger_id);

                var fcmTokens = []
                /*if (leader.fcmId) {
                    fcmTokens.push({
                        id: ride.fcmId,
                        device: ride.deviceType,
                        user: leader._id
                    });
                } else {
                    fcmTokens.push({
                        user: leader._id
                    });
                }*/

                var message = "Passenger " + passenger.name + " has been added to your car.";

                notifications.sendToDevice(fcmTokens, ride.event.name, message, "", function (err) {
                    if (err) {
                        return res.send(err);
                    }
                });

                ride.save();
                return res.status(200).send({Warning: "Push Notifications disabled until Passengers are set up to be registered users"});
                //return res.status(200).json(ride);
            });
        });
    });

router.route('/:id/passengers/:passenger_id')
    .delete(function (req, res) {
        keystone.list("Passenger").model.findOne().where("_id", req.params.passenger_id).exec(function (err, passenger) {
            model.findOne().where("_id", req.params.id).populate("event").exec(function (err, ride) {
                var index = ride.passengers.indexOf(req.params.passenger_id);
                ride.passengers.splice(index, 1);

                async.series([function (cb) {
                    // START: Send Notification to Driver
                    var fcmTokens = []
                    /*if (leader.fcmId) {
                        fcmTokens.push({
                            id: ride.fcmId,
                            device: ride.deviceType,
                            user: leader._id
                        });
                    } else {
                        fcmTokens.push({
                            user: leader._id
                        });
                    }*/

                    var message = "Passenger " + passenger.name + " has been dropped from your car.";

                    notifications.sendToDevice(fcmTokens, ride.event.name, message, "", function (err) {
                        if (err) {
                            return res.send(err);
                        }
                        cb();
                    });
                    // END: Send Notification to Driver
                }, function (cb) {
                    // START: Send Notification to Passenger
                    var fcmTokens = []
                    /*if (leader.fcmId) {
                        fcmTokens.push({
                            id: passenger.fcmId,
                            device: passenger.deviceType,
                            user: leader._id
                        });
                    } else {
                        fcmTokens.push({
                            user: leader._id
                        });
                    }*/

                    var message = "You have been dropped from a ride to " + ride.event.name + ".";

                    notifications.sendToDevice(fcmTokens, notificationTitle, message, "", function (err) {
                        if (err) {
                            return res.send(err);
                        }
                        cb();
                    });
                    // END: Send Notification to Passenger
                }]);
                passenger.remove();
                ride.save();
                return res.status(200).send({Warning: "Push Notifications disabled until Passengers are set up to be registered users"});
                //return res.json(ride);
            });
        });
    });


module.exports = router;
