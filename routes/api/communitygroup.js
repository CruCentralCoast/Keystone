var async = require('async'),
	keystone = require('keystone'),
    restUtils = require('./restUtils'),
	express = require('express'),
	router = express.Router();

var notifications = require('./notificationUtils');

var CommunityGroup = keystone.list("CommunityGroup");
var MinistryQuestionAnswer = keystone.list('MinistryQuestionAnswer').model;
var model = CommunityGroup.model;

router.route('/')
	.get(function(req, res, next) {
        model.find({}).populate('leaders').exec(function(err, communitygroups){
            if (err) return res.status(400).send(err);
            return res.json(communitygroups);
        });
    })
	.post(function(req, res, next) {
		restUtils.create(model, req, res);
	});

router.route('/:id')
	.get(function(req, res, next) {
        model.findOne({_id: req.params.id}).populate('leaders').exec(function(err, communitygroup){
            if (err) return res.status(400).send(err);
            return res.json(communitygroup);
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

router.route('/:id/answers')
	.get(function(req, res, next) {
		MinistryQuestionAnswer.find({communityGroup : req.params.id}).exec(function(err, answers) {
			if (err) return res.send(err);
			return res.json(answers);
		});
	});

router.route('/:id/leaders')
    .get(function(req, res, next) {
        model.findOne({_id: req.params.id}).populate('leaders').exec(function(err, communitygroup){
            if (err) return res.status(400).send(err);
            return res.json(communitygroup.leaders);
        });
    });

router.route('/:id/ministry')
    .get(function(req, res, next) {
        model.findOne({_id: req.params.id}).populate('ministry').exec(function(err, communitygroup){
            if (err) return res.status(400).send(err);
            return res.json(communitygroup.ministry);
        });
    });

router.route('/:id/join')
    .post(function(req, res, next) {
        var communityGroupId = req.params.id;
        var name = req.body.name;
        var phone = req.body.phone;

        model.findById(communityGroupId).populate("leaders").exec(function(err, group) {
            if (err) return res.apiError('failed to join community  group', err);

            var leaderInfo = [];
            var regTokens = [];

            // for every leader send them the person that joined's info
            // and get their info to send to the user
            group.leaders.forEach(function(leader) {
                leaderInfo.push({
                    name: leader.name,
                    phone: leader.phone,
                    email: leader.email
                });
                if (leader.fcmId) {
                    regTokens.push(leader.fcmId);
                }
            });

            var message = name.first + " " + name.last + " wants to join " + group.name + ". Their phone number is " + phone + ".";
            var payload = fcmUtils.createMessage(name, phone);
            // {
            //     data: {
            //         type: 'communitygroup_join',
            //         name: name,
            //         phone: phone
            //     }
            // };

            regTokens.forEach(function(token) {
                notifications.send(token, group.name, message, payload, function(err, response, body) {
                    console.log(body);
                });
            });
            res.json(leaderInfo);
        });
    });

module.exports = router;
