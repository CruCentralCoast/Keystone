var async = require('async'),
	keystone = require('keystone'),
	request = require('request'),
    gcm = require('node-gcm'),
    restUtils = require('./restUtils'),
    dotenv = require('dotenv'),
	express = require('express'),
	router = express.Router(),
    gcmUtils = require('./gcmUtils');

dotenv.load();
var Notification = keystone.list("Notification");
var model = Notification.model;

var gcmAPIKey = process.env.GCM_API_KEY; // Unique to each group

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

// Pushes a simple notification to a topic
router.route('/push')
	.post(function(req, res) {
		var success = true;

		req.body.ministries.forEach(function(ministryString, index) {
            console.log(ministryString);
            var find = ministryString!= 'global' ? {_id : ministryString} : {name:''};
			keystone.list('Ministry').model.find(find)
                .exec(function(err, ministries) {
                if (err) return res.send(err);
                // Defaults to everyone if no ministries are selected
                if (ministries.length == 0) {
                    ministries = [{_id: 'global', name: 'Cru Central Coast'}]
                }
                ministries.forEach(function(ministry) {
                    var to = '/topics/' + ministry._id;

                    // Sets up the message data
                    var message = gcmUtils.createMessage(ministry.name, req.body.msg);

                    // Sets up the sender based on the API key
                    var sender = new gcm.Sender(gcmAPIKey);

                    sender.send(message, { topic: to }, function (err, response) {
                        if (err) {
                            console.error(err);
                            success = false;
                        }
                        else {
                            // returns the message
                            return res.json({
                                post: req.body.msg,
                                success: success
                            });
                        }
                    });
                });
            });
		});
	});
    
// Adds an event notification from the even tnotification page
// TODO: Debate moving this to the view controller
router.route('/eventNotification')
	.post(function(req, res) {
		var Event = keystone.list('Event').model;
		var Notification = keystone.list('Notification').model;

		var newNotifiation;

		Event.findOne().where('_id', req.body.event_id).exec(function(err, event) {
            if (err) return res.send(err);
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

			res.json(newNotifiation);
		});
	});

// Sets a recurring timer to send scheduled push notifications every minute
setInterval(function() {
    var gcm = require('node-gcm');
    
    // Queries a list of unsent messages
    keystone.list('Notification').model.find().where('sent', false).where('time').lte(Date.now()).populate('ministries')
        .exec(function(err, notifications) {
            if (err) return res.send(err);
            if(notifications)
            {
                notifications.forEach( function(notification) {
                
                    // Sends the notification to everyone if no ministries are selected
                    if (notification.ministries.length == 0) {
                        notification.ministries = [{_id: 'global', name: 'Cru Central Coast'}]
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

module.exports = router;
