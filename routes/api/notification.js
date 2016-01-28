var async = require('async'),
	keystone = require('keystone'),
	request = require('request'),
    gcm = require('node-gcm'),
    restUtils = require('./restUtils');

var Notification = keystone.list("Notification");
var model = Notification.model;

var gcmAPIKey = 'AIzaSyDM635SwFgCm2X83cpdvo22LQTPbmGMOPs';

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
    
//updates a notification
exports.update = function(res, res) {
        restUtils.update(model, req, res);
}
    
// Sends the push notification
exports.push = function(req, res) {
    var success= true;
    
    req.body.ministries.forEach(function(ministryString, index) {
        keystone.list('Ministry').model.find().where('_id', ministryString)
            .exec(function(err, ministries) {
            if (!ministries) {
                ministries = [{topic: 'global'}]
            }
            ministries.forEach(function(ministry) {
                var to = '/topics/' + ministry._id;	
    
                // Sets up the message data
                var message = new gcm.Message({
                    data: {
                        message: req.body.msg,
                        title: ministry.name
                    }
                });
                
                // Sets up the sender based on the API key
                var sender = new gcm.Sender(gcmAPIKey);
                
                sender.send(message, { topic: to }, function (err, response) {
                    if (err) {
                        console.error(err);
                        success = false;
                    }
                    else {
                        console.log(response);
                    }
                });
            });
        });
    });

	res.apiResponse({
		post: req.body.msg,
        success: success
	});
}

exports.addEventNotification = function(req, res) {
    var Event = keystone.list('Event').model;
    var Notification = keystone.list('Notification').model;
    
    var newNotifiation;
    
    Event.findOne().where('_id', req.body.event_id).exec(function(err, event) {
        // Calculates the time before an event to set the notification
        var timeBefore = req.body.days ? req.body.days * 24 * 60 * 60 * 1000 : 0;
        timeBefore += req.body.hours ? req.body.hours * 60 * 60 * 1000 : 0;
        timeBefore += req.body.minutes ? req.body.minutes * 60 * 1000 : 0;
        
        var date = new Date(event.startDate.getTime() - timeBefore);
        
        newNotifiation = new Notification({
            message: req.body.message,
            time: date,
            ministries: event.parentMinistries
        });
        
        newNotifiation.save();
        event.notifications.push(newNotifiation);
        event.save();
        
        res.apiResponse({
            post: newNotifiation
        });
    });  
}

// Sets a recurring timer to send scheduled push notifications every minute
setInterval(function() {
    var gcm = require('node-gcm');
    
    // Queries a list of unsent messages
    keystone.list('Notification').model.find().where('sent', false).where('time').lte(Date.now()).populate('ministries')
        .exec(function(err, notifications) {
            if(notifications)
            {
                notifications.forEach( function(notification) {
                
                    // Sends the notification to everyone if no ministries are selected
                    if (notification.ministries.length == 0) {
                        notification.ministries = [{topic: 'global', name: 'Cru Central Coast'}]
                    }
                    notification.ministries.forEach(function(ministry) {
                        var to = '/topics/' + ministry._id;
            
                        // Sets up the message data
                        var message = new gcm.Message({
                            data: {
                                message: notification.message,
                                title: ministry.name
                            }
                        });
                        
                        // Sets up the sender based on the APIkey
                        var sender = new gcm.Sender(gcmAPIKey);
                        
                        sender.send(message, { topic: to }, function (err, response) {
                            if (err) {
                                console.error(err);
                                success = false;
                            }
                            else {
                                console.log(response);
                                notification.sent = true;
                                notification.save();
                            }
                        });
                    });
                });
            }
        });   
}, 60000); // Specifies the time to run this function