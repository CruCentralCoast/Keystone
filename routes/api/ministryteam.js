var async = require('async'),
	keystone = require('keystone'),
	express = require('express'),
	router = express.Router(),
	restUtils = require('./restUtils');

var MinistryTeam = keystone.list("MinistryTeam");
var model = MinistryTeam.model;

router.route('/list')
	.get(function(req, res, next) {
		restUtils.list(model, req, res);
	});

router.route('/get/:id')
	.get(function(req, res, next) {
		restUtils.get(model, req, res);
	});

router.route('/find')
	.post(function(req, res, next) {
		restUtils.find(model, req, res);
	});

router.route('/create')
	.post(function(req, res, next) {
		restUtils.create(model, req, res);
	});

router.route('/update')
	.post(function(req, res, next) {
		restUtils.update(model, req, res);
	});

module.exports = router;
