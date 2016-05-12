var keystone = require('keystone'),
    propertyReader = require('properties-reader'),
    root = require("app-root-path");

var properties = propertyReader(root + '/properties.ini');
var leaderAPIKey = properties.path().leader.api.key;

module.exports = {

	signin: function(req, res) {
  
		if (!req.body.username || !req.body.password) return res.json({ success: false });
  
			keystone.list('User').model.findOne({ email: req.body.username }).exec(function(err, user) {
				if (err || !user) {
					return res.json({
						success: false,
						message: (err && err.message ? err.message : false) || 'Sorry, there was an issue signing you in, please try again.'
					});
				}

				keystone.session.signin({ email: user.email, password: req.body.password }, req, res, function(user) {
                    if (req.body.gcmId) {
                        var model = keystone.list("User").model;
                        user.getUpdateHandler(req).process({email:user.email, gcmId:req.body.gcmId}, function(err) {
                            console.log(err)
                        })
                    }
					return res.json({
						success: true,
						LeaderAPIKey: leaderAPIKey 
					});
				}, function(err) {
					return res.json({
						success: false,
						message: (err && err.message ? err.message : false) || 'Sorry, there was an issue signing you in, please try again.'
					});
				});
			});
	},

	signout: function(req, res) {
		keystone.session.signout(req, res, function() {
			res.json({ 'signedout': true });
		});
	}

}
