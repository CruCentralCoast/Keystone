var async = require('async');
var crypto = require('crypto');
var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Users Model
 * ===========
 */

var User = new keystone.List('User', {
	track: true,
	autokey: { path: 'key', from: 'name', unique: true }
});

var deps = {
	mentoring: { 'mentoring.available': true },

	github: { 'services.github.isConfigured': true },
	facebook: { 'services.facebook.isConfigured': true },
	google: { 'services.google.isConfigured': true },
	twitter: { 'services.twitter.isConfigured': true }
}

User.add({
	name: { type: Types.Name, required: true, index: true },
	email: { type: Types.Email, initial: true, index: true },
	password: { type: Types.Password, initial: true },
	resetPasswordKey: { type: String, hidden: true }
}, 'Profile', {
	isPublic: { type: Boolean, default: true },
	isOrganiser: Boolean,
	organization: { type: Types.Relationship, ref: 'Organization' },
	isStaff: { type: Boolean, label: 'Is on Staff With Cru'},
	isCommunityGroupLeader: { type: Boolean, label: 'Is a community group leader'},
	isMinistryTeamLeader: { type: Boolean, label: 'Is a ministry team leader'},
	photo: { type: Types.CloudinaryImage },
	github: { type: String, width: 'short' },
	twitter: { type: String, width: 'short' },
	website: { type: Types.Url },
	bio: { type: Types.Markdown },
	gravatar: { type: String, noedit: true }
}, 'Notifications', {
	notifications: {
		posts: { type: Boolean },
		meetups: { type: Boolean, default: true }
	}
}, 'Permissions', {
	isAdmin: { type: Boolean, label: 'Can admin the website' },
	isVerified: { type: Boolean, label: 'Has a verified email address' }
});


/**
	Pre-save
	=============
*/

User.schema.pre('save', function(next) {
	var member = this;
	async.parallel([
		function(done) {
			if (!member.email) return done();
			member.gravatar = crypto.createHash('md5').update(member.email.toLowerCase().trim()).digest('hex');
			return done();
		},
		function(done) {
			keystone.list('Talk').model.count({ who: member.id }).exec(function(err, count) {
				if (err) {
					console.error('===== Error counting user talks =====');
					console.error(err);
					return done();
				}
				member.talkCount = count;
				return done();
			});
		},
		function(done) {
			keystone.list('RSVP').model.findOne({ who: member.id }).sort('changedAt').exec(function(err, rsvp) {
				if (err) {
					console.error("===== Error setting user last RSVP date =====");
					console.error(err);
					return done();
				}
				if (!rsvp) return done();
				member.lastRSVP = rsvp.changedAt;
				return done();
			});
		}
	], next);
});


/**
	Relationships
	=============
*/

User.relationship({ ref: 'Post', refPath: 'author', path: 'posts' });
User.relationship({ ref: 'Talk', refPath: 'who', path: 'talks' });
User.relationship({ ref: 'RSVP', refPath: 'who', path: 'rsvps' });


/**
 * Virtuals
 * ========
 */

// Link to member
User.schema.virtual('url').get(function() {
	return '/member/' + this.key;
});

// Provide access to Keystone
User.schema.virtual('canAccessKeystone').get(function() {
	return this.isAdmin;
});


/**
 * Methods
 * =======
*/

User.schema.methods.resetPassword = function(callback) {
	var user = this;
	user.resetPasswordKey = keystone.utils.randomString([16,24]);
	user.save(function(err) {
		if (err) return callback(err);
		new keystone.Email('forgotten-password').send({
			user: user,
			link: '/reset-password/' + user.resetPasswordKey,
			subject: 'Reset your Cru Admin Password',
			to: user.email,
			from: {
				name: 'Cru Central Coast',
				email: 'contact@crucentralcoast.com'
			}
		}, callback);
	});
}


/**
 * Registration
 * ============
*/

User.defaultColumns = 'name, email, isAdmin';
User.register();
