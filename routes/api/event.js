var keystone = require('keystone'),
    restUtils = require('./restUtils'),
    express = require('express'),
    router = express.Router();

var Event = keystone.list("Event");
var model = Event.model;
var Ride = keystone.list("Ride");

router.route('/')
    .get(function (req, res) {
        restUtils.list(model, req, res);
    })
    .post(function (req, res) {
        restUtils.create(model, req, res);
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

router.route('/:id/ministries')
    .get(function (req, res) {
        model.find({ _id: req.params.id }).populate('ministries').exec(function (err, event) {
            if (err) return res.status(400).send(err);
            return res.json(event.ministries);
        });
    });

router.route('/:id/notifications')
    .get(function (req, res) {
        model.find({ _id: req.params.id }).populate('notifications').exec(function (err, event) {
            if (err) return res.status(400).send(err);
            return res.json(event.notifications);
        });
    });

// used for determining if a user already has a ride for an event
router.route('/:id/:fcm_id')
    .get(function (req, res) {
        Ride.model.findOne({ event: req.params.id, fcm_id: req.params.fcm_id }).exec(function (err, ride) {
            if (err) return res.status(400).send(err);
            if (ride)
                return res.status(200).json({ value: 1 }); //fcm_id is driving for this event

            Ride.model.find({ event: req.params.id }).populate('passengers').exec(function (err, rides) {
                console.log(rides);
                // filters out all invalid rides
                rides = rides.filter(function (ride) {
                    var passengers = ride.passengers;
                    console.log(passengers);
                    // Finds passengers where their fcm_id matches
                    passengers = passengers.filter(function (passenger) {
                        console.log(passenger.fcm_id == req.params.fcm_id);
                        return passenger.fcm_id == req.params.fcm_id;
                    });
                    return passengers.length && ride.event == req.params.id;
                });
                if (rides.length)
                    return res.status(200).json({ value: 2 }); // fcm_id is passenger for event
                return res.status(200).json({ value: 0 }); // is not a passenger
            });
        });
    });

module.exports = router;
