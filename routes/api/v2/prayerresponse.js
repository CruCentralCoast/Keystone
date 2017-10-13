var keystone = require('keystone'),
    express = require('express'),
    router = express.Router();

var PrayerResponse = keystone.list('PrayerResponse');
var model = PrayerResponse.model;

var reqModel = keystone.list('PrayerRequest').model;
var leaderAPIKey = process.env.LEADER_API_KEY;

router.route('/')
    .post(function (req, res) {
        reqModel.findById(req.body.prayerRequestId).select().exec(function (err, prayerrequest) {
            if (err) return res.status(400).send(err);
            if (!prayerrequest) return res.status(400).send(prayerrequest);
            var isLeader = req.query.LeaderAPIKey && req.query.LeaderAPIKey == leaderAPIKey;
            var isAuthor = req.query.fcm_id && req.query.fcm_id == prayerrequest.fcm_id;
            if (prayerrequest.leadersOnly && !isLeader && !isAuthor) {
                return res.status(403).send('not authorized');
            }
            model.create(req.body, function (err, prayerresponse) {
                if (err) return res.status(400).send(err);
                prayerrequest.prayerResponse.push(prayerresponse.id);
                prayerrequest.save();
                return res.status(201).json(prayerresponse);
            });
        });
    });

module.exports = router;