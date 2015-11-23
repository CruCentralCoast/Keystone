var async = require('async'),
	keystone = require('keystone'),
	restUtils = require('./restUtils');

var Campus = keystone.list("Campus");
var model = Campus.model;

// lists all campuses
exports.list = function(req, res) {
	restUtils.list(model, req, res);
}

// get a campus by id
exports.get = function(req, res) {
	restUtils.get(model, req, res);
}

// comment
exports.find = function(req, res) {
	restUtils.find(model, req, res);
}

//create a campus
exports.create = function(req, res) {
	restUtils.create(model, req, res);
}
