var async = require('async'),
	keystone = require('keystone'),
	restUtils = require('./restUtils');

var Ministry = keystone.list("Ministry");
var model = Ministry.model;

// lists all ministries
exports.list = function(req, res) {
	restUtils.list(model, req, res);
}

// get a ministry by id
exports.get = function(req, res) {
	restUtils.get(model, req, res);
}

// comment
exports.find = function(req, res) {
	restUtils.find(model, req, res);
}

//create a ministry
exports.create = function(req, res) {
	restUtils.create(model, req, res);
}

//updates a ministry
exports.update = function(req, res) {
    restUtils.update(model, req, res);
}