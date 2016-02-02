var async = require('async'),
	keystone = require('keystone'),
    gcm = require('node-gcm'),
    propertyReader = require('properties-reader'),
    root = require("app-root-path"),
    restUtils = require('./restUtils');

var Ride = keystone.list("Ride");
var model = Ride.model;

var properties = propertyReader(root + '/properties.ini');
var gcmAPIKey = properties.path().gcm.api.key;

exports.list = function(req, res) {
	restUtils.list(model, req, res);
}

exports.get = function(req, res) {
	restUtils.get(model, req, res);
}

exports.find = function(req, res) {
        restUtils.find(model, req, res);
}

exports.create = function(req, res) {
        restUtils.create(model, req, res);
}

//updates a Ride
exports.update = function(req, res) {
    restUtils.update(model, req, res);
}

// adds a passenger to the current ride
exports.addPassenger = function(req, res) {  
    keystone.list("Passenger").model.findOne().where("_id", req.body.passenger_id).exec(function(err, passenger) {
        model.findOne().where("_id", req.body.ride_id).populate("event").exec(function(err, ride) {
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
            res.apiResponse(ride);
        });
    });   
}

// adds a passenger to the current ride
exports.dropPassenger = function(req, res) { 
    keystone.list("Passenger").model.findOne().where("_id", req.body.passenger_id).exec(function(err, passenger) {
        model.findOne().where("_id", req.body.ride_id).populate("event").exec(function(err, ride) {
        
            var index = ride.passengers.indexOf(req.body.passenger_id);
            ride.passengers.splice(index, 1);
            
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
                       
            ride.save();
            res.apiResponse(ride);
        });
    });
}