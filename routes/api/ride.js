var async = require('async'),
	keystone = require('keystone'),
    gcm = require('node-gcm'),
    propertyReader = require('properties-reader'),
    root = require("app-root-path"),
    restUtils = require('./restUtils'),
	express = require('express'),
	router = express.Router();

var model = keystone.list("Ride").model;

var properties = propertyReader(root + '/properties.ini');
var gcmAPIKey = properties.path().gcm.api.key;

var notificationTitle = "Cru Ride Sharing";

router.route('/list')
	.get(function(req, res, next) {
		restUtils.list(model, req, res);
	});

router.route('/:id')
	.get(function(req, res, next) {
		restUtils.get(model, req, res);
	});

router.route('/find')
	.post(function(req, res, next) {
		restUtils.find(model, req, res);
	});

router.route('/create')
	.post(function(req, res, next) {
		restUtils.create(model, req, res);
	});
    
router.route('/search')
    .post(function(req, res, next) {
        restUtils.search(model, req, res);
    });

router.route('/update')
	.post(function(req, res, next) {
		restUtils.update(model, req, res);
	});

router.route('/enumValues/:key')
	.get(function(req, res, next) {
		restUtils.enumValues(model, req, res);
	});

router.route('/addPassenger')
	.post(function(req, res) {
		keystone.list("Passenger").model.findOne().where("_id", req.body.passenger_id).exec(function(err, passenger) {
			model.findOne().where("_id", req.body.ride_id).populate("event").exec(function(err, ride) {
				if (ride.passengers.indexOf(req.body.passenger_id) == -1)
					ride.passengers.push(req.body.passenger_id);

				var regTokens = [ride.gcm_id];

				// Sets up the message data
				var message = new gcm.Message({
					data: {
						message: "Passenger " + passenger.name + " has been added to your car.",
						title: ride.event.name
					}
				});

				// Sets up the sender based on the API key
				var sender = new gcm.Sender(gcmAPIKey);

				sender.send(message, { registrationTokens: regTokens }, function (err, response) {
					if (err) {
						console.error(err);
						success = false;
					}
					else {
						console.log(response);
					}
				});
				ride.save();
				return res.status(200).json(ride);
			});
		});
	});

router.route('/dropPassenger')
	.post(function(req, res) {
		keystone.list("Passenger").model.findOne().where("_id", req.body.passenger_id).exec(function(err, passenger) {
			model.findOne().where("_id", req.body.ride_id).populate("event").exec(function(err, ride) {


				var index = ride.passengers.indexOf(req.body.passenger_id);
				ride.passengers.splice(index, 1);

				// START: Send Notification to Driver
				var regTokens = [ride.gcm_id];

				// Sets up the message data
				var message = new gcm.Message({
					data: {
						message: "Passenger " + passenger.name + " has been dropped from your car.",
						title: ride.event.name
					}
				});

				// Sets up the sender based on the API key
				var sender = new gcm.Sender(gcmAPIKey);

				sender.send(message, { registrationTokens: regTokens }, function (err, response) {
					if (err) {
						console.error(err);
						success = false;
					}
					else {
						console.log(response);
					}
				});
				// END: Send Notification to Driver

				// START: Send Notification to Passenger
				regTokens = [passenger.gcm_id];

				// Sets up the message data
				message = new gcm.Message({
					data: {
						message: "You have been dropped from a ride to " + ride.event.name + ".",
						title: notificationTitle
					}
				});

				sender.send(message, { registrationTokens: regTokens }, function (err, response) {
					if (err) {
						console.error(err);
						success = false;
					}
					else {
						console.log(response);
					}
				});
				// END: Send Notification to Passenger

				keystone.list("Passenger").model.remove(passenger);
				ride.save();
				return res.json(ride);
			});
		});
	});

router.route('/dropRide')
	.post(function(req, res) {
		model.findOne().where("_id", req.body.ride_id).populate("passengers").populate("event").exec(function(err, ride) {

			success = true;

			// START: Send Notification to Passengers
			var regTokens = [];
			ride.passengers.forEach(function(passenger) {
				regTokens.push(passenger.gcm_id);
			});

			// Sets up the message data
			var message = new gcm.Message({
				data: {
					message: "You have been dropped from a ride to " + ride.event.name + ".",
					title: notificationTitle
				}
			});

			var sender = new gcm.Sender(gcmAPIKey);

			sender.send(message, { registrationTokens: regTokens }, function (err, response) {
				if (err) {
					console.error(err);
					success = false;
				}
				else {
					console.log(response);
				}
			});
			// END: Send Notification to Passenger

			ride.passengers.forEach(function(passenger) {
				passenger.remove();
			});
			ride.remove();
			return res.status(204).json();
		});
	});

module.exports = router;
