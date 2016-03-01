var async = require('async'),
	keystone = require('keystone'),
    restUtils = require('./restUtils');

var CommunityGroup = keystone.list("CommunityGroup");
var model = CommunityGroup.model;

exports.list = function(req, res) {
	restUtils.list(model, req, res);
}

exports.get = function(req, res) {
	restUtils.get(model, req, res);
}

exports.find = function(req, res) {
        restUtils.find(model, req, res);
}

exports.search = function(req, res) {
        restUtils.search(model, req, res);
}

exports.create = function(req, res) {
        restUtils.create(model, req, res);
}

//updates a CommunityGroup
exports.update = function(req, res) {
    restUtils.update(model, req, res);
}
