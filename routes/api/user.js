var async = require('async'),
	keystone = require('keystone'),
    express = require('express'),
    router = express.Router(),
	restUtils = require('./restUtils');

var User = keystone.list("User");
var model = User.model;

router.route('/phone/:number')
    .get(function(req, res, next) {
        if (isNaN(req.params.number)) {
            return res.status(400).send('Error: Invalid phone number format.');
        }
        if (req.params.number.length < 10)
        {
            return res.status(400).send('Error: Phone number not long enough.');
        }
        model.findOne({'phone': RegExp(req.params.number + '$')}).exec(function(err, user) {
            if (err) return res.send(err);
            return res.json(user);
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

module.exports = router;
