var keystone = require('keystone'),
    restUtils = require('./restUtils'),
    express = require('express'),
    router = express.Router();

var Passenger = keystone.list("Passenger");
var model = Passenger.model;

router.route('/')
    .get(function (req, res) {
        restUtils.list(model, req, res);
    })
    .post(function (req, res) {
        restUtils.create(model, req, res);
    });

router.route('/available')
    .get(function (req, res) {
        var params = {
            'event': req.query.eventId,
            'has_driver': {
                '$ne': true
            },
            'gender_pref': req.query.genderPref
        };

        model.find(params).exec(function (err, passengers) {
            if (err) return res.send(err);
            return res.json(passengers);
        });
    });

router.route('/:id')
    .get(function (req, res) {
        restUtils.get(model, req, res);
    })
    .patch(function (req, res) {
        restUtils.update(model, req, res);
    });

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

module.exports = router;
