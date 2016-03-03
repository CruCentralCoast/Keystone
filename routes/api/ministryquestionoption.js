/**
 * Created by imeeder on 3/3/16.
 */

var keystone = require('keystone'),
	express = require('express'),
	router = express.Router();

router.route("/")
	.get(function(req, res, next) {
		keystone.list('MinistryQuestionOption').model.find({}, 'value').exec(function(err, options) {
			if (err) return res.send(err);
			return res.json(options);
		})
	});

module.exports = router;
