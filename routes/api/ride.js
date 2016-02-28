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

var notificationTitle = "Cru Ride Sharing";

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

exports.enumValues = function(req, res) {
    restUtils.enumValues(model, req, res);
}

// adds a passenger to the current ride
exports.addPassenger = function(req, res) {  
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
            res.apiResponse(ride);
        });
    });
}

exports.dropRide = function(req, res) {
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
        res.apiResponse(success);
    });
}

// Allows for complex queries sent from a device to the server
exports.search = function(req, res) {
    model.find(req.body.conditions, req.body.projection, req.body.options, function(err, item) {
       if (err) return res.apiError('database error', err);
       res.apiResponse(item);
    });
}