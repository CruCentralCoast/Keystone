var async = require('async'),
    keystone = require('keystone'),
    dotenv = require('dotenv'),
    express = require('express'),
    router = express.Router(),
    gcm = require('node-gcm'),
    restUtils = require('./restUtils'),
    gcmUtils = require('./gcmUtils');

dotenv.load();
var MinistryTeam = keystone.list("MinistryTeam");
var model = MinistryTeam.model;

var gcmAPIKey = process.env.GCM_API_KEY;

var notifications = require('./notificationUtils.js');

router.route('/')
	.get(function(req, res, next) {
		model.find().populate("leaders", "name.first name.last email phone").exec(function(err, teams) {
            if (err) return res.status(400).send(err);
            return res.json(teams);
        });
	})
	.post(function(req, res, next) {
		restUtils.create(model, req, res);
	});

router.route('/:id')
	.get(function(req, res, next) {
		model.findById(req.params.id).populate("leaders", "name.first name.last email phone").exec(function(err, team) {
            if (err) return res.status(400).send(err);
            return res.json(team);
        });
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
               
            var message = name.first + " " + name.last + " has joined " + team.name + ". Their phone number is " + phone + ".";
            var payload = {};
            
            notifications.send(regTokens, team.name, message, payload, function(err, res, body) {
                // Do nothing I guess
            });
            
            res.json(response);
        });
    });
    
router.route("/:id/leaders")
    .get(function(req, res, next) {
        model.findOne({_id: req.params.id}).populate("leaders").exec(function(err, team) {
            if (err) return res.status(400).send(err);
            console.log(team.leaders);
            return res.json(team.leaders);
        });
    });

module.exports = router;
