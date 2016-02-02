var async = require('async'),
	keystone = require('keystone'),
	restUtils = require('./restUtils');

var User = keystone.list("User");
var model = User.model;

exports.list = function(req, res) {
        restUtils.list(model, req, res);
}

exports.get = function(req, res) {
        restUtils.get(model, req, res);
}

exports.find = function(req, res) {
        restUtils.find(model, req, res);
}

exports.create = function(req, res) {
        restUtils.create(model, req, res);
}

//updates a user
exports.update = function(req, res) {
    restUtils.update(model, req, res);
}
