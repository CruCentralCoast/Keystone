var async = require('async'),
	keystone = require('keystone'),
	restUtils = require('./restUtils');

var Resource = keystone.list('Resource');
var model = Resource.model;
    
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

//updates a user
exports.update = function(req, res) {
    restUtils.update(model, req, res);
}

exports.enumValues = function(req, res) {
    restUtils.enumValues(model, req, res);
}
