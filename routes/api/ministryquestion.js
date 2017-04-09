/**
 * Created by imeeder on 2/29/16.
 */

var keystone = require('keystone'),
	express = require('express'),
	router = express.Router(),
    restUtils = require('./restUtils');

var MinistryQuestion = keystone.list('MinistryQuestion').model;
var model = MinistryQuestion;
var MinistryQuestionOption = keystone.list('MinistryQuestionOption').model;

router.route('/')
	.get(function(req, res, next) {
		MinistryQuestion.find().populate({
			path: 'selectOptions',
			select: 'value -_id'
		}).exec(function(err, questions) {
			if (err) return res.send(err);
			return res.json(questions);
		})
	});

router.route('/:id')
	.get(function(req, res, next) {
		MinistryQuestion.findOne({_id: req.params.id}).populate({
			path: 'selectOptions',
			select: 'value -_id'
		}).exec(function(err, question) {
			if (err) return res.send(err);
			return res.json(question);
		});
	})
    .patch(function(req, res, next) {
		restUtils.update(model, req, res);
	});
    
// Adds an option to a question
router.route('/:id/options')
    .patch(function(req, res, next) {
        MinistryQuestion.findOne({_id: req.params.id}).exec(function(err, question) {
            if (err) return res.send(err);
             MinistryQuestionOption.findOne({value : req.body.value}).exec(function(err, option) {
                if (err) return res.send(err);
                question.selectOptions.push(option._id);
                question.save();
                return res.json(question);
             });
        });
    });

    
// Removes an option from a question
router.route('/:id/options/:value')
    .delete(function(req, res, next) {
        MinistryQuestion.findOne({_id: req.params.id}).exec(function(err, question) {
            if (err) return res.send(err);
            MinistryQuestionOption.findOne({value : req.params.value}).exec(function(err, option) {
                if (err) return res.send(err);
                 var index = question.selectOptions.indexOf(option._id);
                if (index > -1)
                    question.selectOptions.splice(index, 1);
                question.save();
                return res.json(question);
            });
        });
    });
    
module.exports = router;
