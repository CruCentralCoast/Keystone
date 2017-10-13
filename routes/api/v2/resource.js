var keystone = require('keystone'),
    restUtils = require('./restUtils'),
    express = require('express'),
    router = express.Router();

var Resource = keystone.list('Resource');
var model = Resource.model;

var leaderAPIKey = process.env.LEADER_API_KEY;


router.route('/')
    .get(function (req, res) {
        var params = {};
        if (req.query.LeaderAPIKey != leaderAPIKey) {
            params = { "restricted": { "$ne": true } };
        }
        model.find(params).exec(function (err, items) {
            if (err) return res.send(err);
            return res.json(items);
        });
    });

router.route('/:id')
    .get(function (req, res) {
        model.findById(req.params.id).exec(function (err, item) {
            if (err) return res.send(err);
            if (!item) return res.send('not found');
            if (item.tags.contains(leaderTagID) && req.query.LeaderAPIKey != leaderAPIKey) { //TODO: Figure out what this does
                return res.send("not authorized");
            }
            return res.json(item);
        });
    });

router.route('/find')
    .post(function (req, res) {
        if (req.query.LeaderAPIKey != leaderAPIKey) {
            req.body = { "$and": [req.body, { "restricted": { "$ne": true } }] };
        }
        restUtils.find(model, req, res);
    });

router.route('/search')
    .post(function (req, res) {
        if (req.query.LeaderAPIKey != leaderAPIKey) {
            req.body.conditions = { "$and": [req.body.conditions, { "restricted": { "$ne": true } }] };
        }
        restUtils.search(model, req, res);
    });

router.route("/")
    .post(function (req, res) {
        restUtils.create(model, req, res);
    });

router.route("/:id")
    .patch(function (req, res) {
        restUtils.update(model, req, res);
    });

router.route('/enumValues/:key')
    .get(function (req, res) {
        restUtils.enumValues(model, req, res);
    });

module.exports = router;
