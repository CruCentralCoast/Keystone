var async = require('async'),
	keystone = require('keystone'),
    express = require('express'),
    router = express.Router(),
	restUtils = require('./restUtils');

var User = keystone.list("User");
var model = User.model;

router.route('/list')
	.get(function(req, res, next) {
		restUtils.list(model, req, res);
	});

router.route('/:id')
	.get(function(req, res, next) {
		restUtils.get(model, req, res);
	});

router.route('/find')
	.post(function(req, res, next) {
		restUtils.find(model, req, res);
	});

router.route('/search')
	.post(function(req, res, next) {
		restUtils.search(model, req, res);
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
