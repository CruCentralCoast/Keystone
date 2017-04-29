var async = require('async'),
    keystone = require('keystone'),
    express = require('express'),
    router = express.Router(),
    restUtils = require('./restUtils');

var MinistryTeam = keystone.list("MinistryTeam");
var model = MinistryTeam.model;

var notifications = require('./notificationUtils');
var fcmUtils = require('./fcmUtils');

router.route('/')
	.get(function(req, res, next) {
		model.find().populate('leaders').exec(function(err, teams) {
            if (err) return res.status(400).send(err);
            return res.json(teams);
        });
	})
	.post(function(req, res, next) {
		restUtils.create(model, req, res);
	});

router.route('/:id')
	.get(function(req, res, next) {
		model.findById(req.params.id).populate('leaders').exec(function(err, team) {
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

router.route('/:id/join').post(function(req, res, next) {
    var ministryTeamId = req.params.id;
    var name = req.body.name;
    var phone = req.body.phone;

    model.findById(ministryTeamId).populate("leaders").exec(function(err, team) {
        if (err) return res.apiError('failed to join ministry team', err);

        var leaderInfo = [];
        var fcmTokens = [];

        // for every leader send them the person that joined's info
        // and get their info to send to the user
        team.leaders.forEach(function(leader) {
            leaderInfo.push({
                name: leader.name,
                phone: leader.phone,
                email: leader.email
            });
            if (leader.fcmId) {
                fcmTokens.push(leader.fcmId);
            }
        });

        var payload = fcmUtils.createMessage(team.name,
            name.first + " " + name.last + " wants to join " +
            team.name + ". Their phone number is " + phone + ".");
        // {
        //     notification: {
        //         title: team.name,
        //         body: name.first + " " + name.last + " wants to join " +
        //             team.name + ". Their phone number is " + phone + "."
        //     },
        //     data: {
        //         type: 'ministryteam_join',
        //         name: name,
        //         phone: phone
        //     }
        // };

        notifications.send(fcmTokens, payload, function(err, response, body) {
            console.log(body);
        });

        res.json(leaderInfo);
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
