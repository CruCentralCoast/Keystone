var async = require('async'),
	keystone = require('keystone'),
    express = require('express'),
    router = express.Router(),
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

// router.route("/enumValues/:key")
    // .get(function(req, res, next) {
        // return res.json(model.schema.path(req.params.key).options.options);
    // });
    
// module.exports = router;