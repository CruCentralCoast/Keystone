var async = require('async'),
	keystone = require('keystone'),
	request = require('request'),
    gcm = require('node-gcm');

// Sends the push notification
exports.push = function(req, res) {
    var APIkey = 'AIzaSyDM635SwFgCm2X83cpdvo22LQTPbmGMOPs';
	var ministry = JSON.parse(req.body.ministry);
	var to = '/topics/' + ministry.slug;	
    
    // Sets up the message data
    var message = new gcm.Message({
        data: {
            message: req.body.msg,
            title: ministry.name
        }
    });
    
    // Sets up the sender based on the APIkey
    var sender = new gcm.Sender(APIkey);
    
    sender.send(message, { topic: to }, function (err, response) {
        if (err) {
            console.error(err);
        }
        else {
            console.log(response);
        }
    });

	res.apiResponse({
		post: req.body.msg
	});
}