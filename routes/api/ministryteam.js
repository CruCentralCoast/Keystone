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
		var data = (req.method == 'POST') ? req.body : req.query;
        
        // default 0 means no limit
        var lim = req.query.limit ? req.query.limit : 0;
        // gets order by dynically creating the object specified
        var order = {}; // null, means dont sort
        if (req.query.order) {
            var parts = req.query.order.split(":");
            order[parts[0].replace('{', '')] = parts[1].replace('}', '').replace(' ', '');
        }
        // creates select statements to only grab certain fields
        var selects = {}; // default is an empty object, means grab all
        if (req.query.select) {
            var list = req.query.select.split(",");
            for (var iter = 0; iter < list.length; iter++) {
                selects[list[iter].replace('}', '').replace('{', '').replace(' ', '')] = true;
            }
        }

        model.find(data, selects).limit(lim).sort(order).populate('leaders').exec(function(err, items) {
            if (err) return res.send(err);
            if (!items) return res.send('not found');

            return res.json(items);
        });
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

        fcmTokens.forEach(function(token) {
            if (token) {
                notifications.sendToDevice(token, payload, function(err, response, body) {
                    console.log(body);
                });
            }
        });
        /*notifications.sendToDevice(fcmTokens, payload, function(err, response, body) {
            console.log(body);
        });*/

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
