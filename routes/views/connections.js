/**
 * Created by imeeder on 2/29/16.
 */

var keystone = require('keystone'),
	express = require('express'),
	router = express.Router();

router.route('/')
	.get(function(req, res, next) {
		var view = new keystone.View(req, res);
		view.query('campuses', keystone.list('Campus').model.find());
		view.render('connections');
	});

router.route('/index')
	.get(function(req, res, next) {
		var view = new keystone.View(req, res);
		view.query('campuses', keystone.list('Campus').model.find());
		view.render('./includes/campusList');
	});

router.route('/campus/:campusID')
	.get(function(req, res, next) {
		var view = new keystone.View(req, res);
		
		view.query('ministries', keystone.list('Ministry').model.find({campus: req.params.campusID}));
		view.render('./includes/campusDetails');
	});

router.route('/ministry/:ministryID')
	.get(function(req, res, next) {
		var view = new keystone.View(req, res);
		view.query('ministry', keystone.list('Ministry').model.findById(req.params.ministryID));
		view.query('questions', keystone.list('MinistryQuestion').model.find({ministry: req.params.ministryID}).populate('selectOptions'));
		res.locals['questionTypes'] = keystone.list('MinistryQuestion').model.schema.path('type').enumValues;
		view.query('selectOptions', keystone.list('MinistryQuestionOption').model.find({}, 'value'));
		view.query('communityGroups', keystone.list('CommunityGroup').model.find({ministry: req.params.ministryID}));
		view.render('./includes/ministryDetails');
	});

router.route('/communityGroup/:id')
	.get(function(req, res, next) {
		var view = new keystone.View(req, res);
		view.query('communityGroup', keystone.list('CommunityGroup').model.findById(req.params.id).populate('leaders'));
        keystone.list('CommunityGroup').model.findById(req.params.id).exec(function(err, group) {
            view.query('questions', keystone.list('MinistryQuestion').model.find({ministry: group.ministry}).populate('selectOptions'));
            view.query('answers', keystone.list('MinistryQuestionAnswer').model.find({communityGroup: group._id}));
            view.render('./includes/communityGroupDetails');
        });       
	});
    
module.exports = router;
