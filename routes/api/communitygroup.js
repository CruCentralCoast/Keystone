var keystone = require('keystone'),
    restUtils = require('./restUtils'),
    express = require('express'),
    router = express.Router();

var notifications = require('./notificationUtils');

var CommunityGroup = keystone.list("CommunityGroup");
var MinistryQuestionAnswer = keystone.list('MinistryQuestionAnswer').model;
var model = CommunityGroup.model;

router.route('/')
    .get(function (req, res) {
        model.find({}).populate('leaders members').exec(function (err, communitygroups) {
            if (err) return res.status(400).send(err);
            return res.json(communitygroups);
        });
    })
    .post(function (req, res) {
        restUtils.create(model, req, res);
    });

router.route('/:id')
    .get(function (req, res) {
        model.findById(req.params.id).populate('leaders members').exec(function (err, communitygroup) {
            if (err) return res.status(400).send(err);
            return res.json(communitygroup);
        });
    })
    .patch(function (req, res) {
        model.findById(req.params.id).populate('leaders').exec(function (err, item) {

            if (err) return res.send(err);
            if (!item) return res.send('not found');

            item.getUpdateHandler(req).process(req.body, function (err) {

                if (err) return res.send(err);

                return res.status(200).json(item);
            });

        });
    });
/*.post(function(req, res, next) {
    restUtils.upload(model, req, res);
});*/

router.route('/search')
    .post(function (req, res) {
        restUtils.search(model, req, res);
    });

router.route('/enumValues/:key')
    .get(function (req, res) {
        restUtils.enumValues(model, req, res);
    });

router.route('/find')
    .post(function (req, res) {
        restUtils.find(model, req, res);
    });

router.route('/:id/answers')
    .get(function (req, res) {
        MinistryQuestionAnswer.find({ communityGroup: req.params.id }).exec(function (err, answers) {
            if (err) return res.send(err);
            return res.json(answers);
        });
    });

router.route('/:id/leaders')
    .get(function (req, res) {
        model.findById(req.params.id).populate('leaders').exec(function (err, communitygroup) {
            if (err) return res.status(400).send(err);
            return res.json(communitygroup.leaders);
        });
    });

router.route('/:id/ministry')
    .get(function (req, res) {
        model.findById(req.params.id).populate('ministry').exec(function (err, communitygroup) {
            if (err) return res.status(400).send(err);
            return res.json(communitygroup.ministry);
        });
    });

router.route('/:id/join')
    .post(function (req, res) {
        var communityGroupId = req.params.id;
        var name = req.body.name;
        var phone = req.body.phone;

        model.findById(communityGroupId).populate("leaders").exec(function (err, group) {
            if (err) return res.apiError('failed to join community  group', err);

            var leaderInfo = [];
            var fcmTokens = [];

            // for every leader send them the person that joined's info
            // and get their info to send to the user
            group.leaders.forEach(function (leader) {
                leaderInfo.push({
                    name: leader.name,
                    phone: leader.phone,
                    email: leader.email
                });
                if (leader.fcmId) {
                    fcmTokens.push({
                        id: leader.fcmId,
                        device: leader.deviceType,
                        user: leader._id
                    });
                } else {
                    fcmTokens.push({
                        user: leader._id
                    });
                }
            });

            //console.log(fcmTokens);
            var message = name + " wants to join " + group.name + ". Their phone number is " + phone + ".";

            notifications.sendToDevice(fcmTokens, "Community Group Join", message, "", function (err) {
                if (err) return res.apiError('failed to send notification', err);
            });
            return res.json(leaderInfo);
        });
    });

module.exports = router;
