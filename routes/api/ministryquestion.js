/**
 * Created by imeeder on 2/29/16.
 */

var keystone = require('keystone'),
	express = require('express'),
	router = express.Router();

var MinistryQuestion = keystone.list('MinistryQuestion').model;

router.route('/list')
	.get(function(req, res, next) {
		MinistryQuestion.find().populate({
			path: 'selectOptions',
			select: 'value -_id'
		}).exec(function(err, questions) {
			if (err) return res.send(err);
			return res.json(questions);
		})
	});

router.route('/get/:id')
	.get(function(req, res, next) {
		MinistryQuestion.findOne({_id: req.params.id}).populate({
			path: 'selectOptions',
			select: 'value -_id'
		}).exec(function(err, question) {
			if (err) return res.apiError('database error', err);
			return res.json(question);
		});
	});

module.exports = router;
