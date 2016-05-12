var async = require('async'),
	keystone = require('keystone'),
    restUtils = require('./restUtils'),
	express = require('express'),
	router = express.Router();

var Event = keystone.list("Event");
var model = Event.model;
var Ride = keystone.list("Ride");
var Passenger = keystone.list("Passenger");

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

router.route('/:id/ministries')
    .get(function(req, res, next) {
        model.find({_id: req.params.id}).populate('ministries').exec(function(err, event){
            if (err) return res.status(400).send(err);
            return res.json(event.ministries);
        });
    });

router.route('/:id/notifications')
    .get(function(req, res, next) {
        model.find({_id: req.params.id}).populate('notifications').exec(function(err, event){
            if (err) return res.status(400).send(err);
            return res.json(event.notifications);
        });
    });

router.route('/:id/:gcm_id/')
	.get(function(req, res, next) {
		var status = 0;
		Ride.model.find({event: req.params.id, gcm_id: req.params.gcm_id}).exec(function (err, rides) {
			if(err) return res.status(400).send(err);
			if(rides && rides.length > 0)
				return res.status(200).send({"value": 1})
		
			Passenger.model.find({gcm_id: req.params.gcm_id}).exec(function (err, passengers) {
				if(err) return res.status(400).send(err);
				if(passengers && passengers.length > 0)
				{
					passengers.forEach(function (passenger, index, array){
						Ride.model.find({"$and": [ {"event": req.params.id}, {"passengers": {"$in": [passenger._id]}}]}).exec(function (err, rides) {
							if(err) return res.status(400).send(err);
							if(rides && rides.length > 0) 
								return res.status(200).send({"value": 2})
							else
								return res.status(200).send({"value": 0})	
						})
					});
				}
				else
					return res.status(200).send({"value": 0})
			})
		})
	})
    
module.exports = router;
