var async = require('async'),
    keystone = require('keystone'),
    express = require('express'),
    router = express.Router(),
    gcm = require('node-gcm'),
    propertyReader = require('properties-reader'),
    root = require("app-root-path"),
    restUtils = require('./restUtils'),
    gcmUtils = require('./gcmUtils');

var MinistryTeam = keystone.list("MinistryTeam");
var model = MinistryTeam.model;

var properties = propertyReader(root + '/properties.ini');
var gcmAPIKey = properties.path().gcm.api.key;

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

router.route('/:id/join')
    .post(function(req, res, next) {
        var ministryTeamId = req.params.id;
        var name = req.body.name;
        var phone = req.body.phone;

        var userModel = keystone.list("User").model;
        
        model.findById(ministryTeamId).populate("leaders").exec(function(err, team) {
            if (err) return res.apiError('failed to join ministry team', err);
        
            var response = [];
            var regTokens = [];

            console.log(team.leaders);

            // for every leader send them the person that joined's info
            // and get their info to send to the user
            team.leaders.forEach(function(leader) {
                var leaderInfo = {
                    name: leader.name,
                    phone: leader.phone,
                    email: leader.email
                };
                console.log(leaderInfo);
                if (leader.gcmId) {
                    regTokens.push(leader.gcmId);
                }

                response.push(leaderInfo);
            });
            
            res.json(response);
            
            // send a push notif to all the leaders
            var message = gcmUtils.createMessage(team.name, name + " has joined " + team.name + ". Their phone numer is " + phone + ".");
            
            // Sets up the sender based on the API key
            var sender = new gcm.Sender(gcmAPIKey);
            if (regTokens.length > 0) {
                sender.send(message, { registrationTokens: regTokens }, function (err, response) {
                    if (err) {
                        console.error(err);
                        success = false;
                    }
                    else {
                        console.log(response);
                    }
                });
            }
        });
    })

module.exports = router;
