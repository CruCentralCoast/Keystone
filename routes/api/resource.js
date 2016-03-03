var async = require('async'),
	keystone = require('keystone'),
    propertyReader = require('properties-reader'),
    root = require("app-root-path"),
	restUtils = require('./restUtils'),
    mongoose = require('mongoose');

var Resource = keystone.list('Resource');
var model = Resource.model;

var properties = propertyReader(root + '/properties.ini');
var leaderAPIKey = properties.path().leader.api.key;
var leaderTagID = properties.path().leader.tag.id;

Array.prototype.contains = function ( needle ) {
   for (i in this) {
       if (this[i] == needle) return true;
   }
   return false;
}

exports.list = function(req, res) {
    var params = {};
    if (req.query.LeaderAPIKey != leaderAPIKey) {
        params = {"tags": { "$nin": [leaderTagID]}};
    }
    model.find(params).exec(function(err, items) {
        if (err) return res.apiError('database error', err);

        res.apiResponse(items);
    });
}

exports.get = function(req, res) {
    model.findById(req.params.id).exec(function(err, item) {
        if (err) return res.apiError('database error', err);
        if (!item) return res.apiError('not found');
        if (item.tags.contains(leaderTagID)
             && req.query.LeaderAPIKey != leaderAPIKey) {
            return res.apiError("not authorized");
        }
        res.apiResponse(item);
    });
}

exports.find = function(req, res) {
    if (req.query.LeaderAPIKey != leaderAPIKey) {
       req.body = {"$and":[req.body, {"tags": { "$nin": [leaderTagID] }}]}
    }
    restUtils.find(model, req, res);
}

exports.search = function(req, res) {
    if (req.query.LeaderAPIKey != leaderAPIKey) {
        req.body.conditions = {"$and":[req.body.conditions, {"tags": { "$nin": [leaderTagID] }}]}
    }
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
