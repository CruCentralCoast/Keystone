var async = require('async'),
	keystone = require('keystone'),
    restUtils = require('./restUtils'),
	express = require('express'),
	router = express.Router();

var CommunityGroup = keystone.list("CommunityGroup");
var MinistryQuestionAnswer = keystone.list('MinistryQuestionAnswer').model;
var model = CommunityGroup.model;

router.route('/')
	.get(function(req, res, next) {
        model.find({}).populate('leaders').exec(function(err, communitygroups){
            if (err) return res.status(400).send(err);
            return res.json(communitygroups);
        });
    });
	.post(function(req, res, next) {
		restUtils.create(model, req, res);
	});

router.route('/:id')
	.get(function(req, res, next) {
        model.findOne({_id: req.params.id}).populate('leaders').exec(function(err, communitygroup){
            if (err) return res.status(400).send(err);
            return res.json(communitygroup);
        });
    });
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

router.route('/:id/answers')
	.get(function(req, res, next) {
		MinistryQuestionAnswer.find({communityGroup : req.params.id}).exec(function(err, answers) {
			if (err) return res.send(err);
			return res.json(answers);
		});
	});

router.route('/:id/leaders')
    .get(function(req, res, next) {
        model.findOne({_id: req.params.id}).populate('leaders').exec(function(err, communitygroup){
            if (err) return res.status(400).send(err);
            return res.json(communitygroup.leaders);
        });
    });
    
router.route('/:id/ministry')
    .get(function(req, res, next) {
        model.findOne({_id: req.params.id}).populate('ministry').exec(function(err, communitygroup){
            if (err) return res.status(400).send(err);
            return res.json(communitygroup.ministry);
        });
    });
    
module.exports = router;
