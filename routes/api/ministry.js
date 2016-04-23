var async = require('async'),
	keystone = require('keystone'),
	restUtils = require('./restUtils'),
	express = require('express'),
	router = express.Router();

var Ministry = keystone.list("Ministry");
var model = Ministry.model;

router.route('/:id/questions')
	.get(function(req, res, next) {
		keystone.list('MinistryQuestion').model.find({ministry: req.params.id}).populate("selectOptions").exec(function(err, questions){
			if (err) return res.send(err);
			return res.json(questions);
		});
	});

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

router.route('/:id/teams')
    .get(function(req, res, next) {
        model.find({_id: req.params.id}).populate('teams').exec(function(err, ministry){
            if (err) return res.status(400).send(err);
            return res.json(ministry.teams);
        });
    });
    
router.route('/:id/campus')
    .get(function(req, res, next) {
        model.find({_id: req.params.id}).populate('campus').exec(function(err, ministry){
            if (err) return res.status(400).send(err);
            return res.json(ministry.campus);
        });
    });
    
module.exports = router;
