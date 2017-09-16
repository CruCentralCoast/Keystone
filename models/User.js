var async = require('async');
var crypto = require('crypto');
var keystone = require('keystone');
var Types = keystone.Field.Types;
var imageUtils = require('./utils/ImageUtils');
var validators = require('mongoose-validators');

/**
 * Users Model
 * ===========
 */

var User = new keystone.List('User', {
    track: true,
    autokey: { path: 'key', from: 'name', unique: true }
});

var s3path = process.env.IMAGE_ROOT_PATH + '/users';

User.add({
    name: { type: Types.Name, required: true, index: true },
    email: { type: Types.Email, required: true, initial: true, index: true },
    phone: { 
        type: String, 
        initial: true, 
        index: true , 
        validate: [validators.isNumeric({message: 'Phone number must only include numbers'}), validators.isLength({message: 'Phone number is too short. Must be 10 digits.' }, 10)],
    },
    password: { type: Types.Password, initial: true },
    resetPasswordKey: { type: String, hidden: true }
}, 'Profile', {
    image: {
        type: Types.S3File,
        required: false,
        allowedTypes: imageUtils.allowedTypes,
        s3path: s3path,
        filename: imageUtils.fileName,
        headers: imageUtils.cacheControl,
        format: imageUtils.formatAdminUIPreview
    },
    imageLink: {
        type: Types.Url,
        hidden: false,
        noedit: true,
        watch: true,
        value: imageUtils.imageLinkValue,
        format: imageUtils.imageLinkFormat
    },
    isPublic: { type: Boolean, default: true , label: 'Info is okay to be publicly displayed' },
    isStaff: { type: Boolean, default: false, label: 'Is on Staff With Cru' },
    staffRole: { type: Types.Select, options: 'MTL, Staff, Intern', default: 'Staff', dependsOn: {isStaff: true}, required: true},
    isCommunityGroupLeader: { type: Boolean, default: false, label: 'Is a community group leader' },
    isMinistryTeamLeader: { type: Boolean, default: false, label: 'Is a ministry team leader' },
    isSummerMissionLeader: { type: Boolean, default: false, label: 'Is a summer mission leader' },
    // this conforms to ISO/IEC 5218, which is why the options are what they are.
    sex: { type: Types.Select, numeric: true, emptyOption: false, options: [{ value: 0, label: 'Unknown' }, { value: 1, label: 'Male' }, { value: 2, label: 'Female' }, { value: 9, label: 'Not Applicable' }] },
    schoolYear: { type: Types.Select, numeric: true, emptyOption: false, options: [{ value: 1, label: 'First' }, { value: 2, label: 'Second' }, { value: 3, label: 'Third' }, { value: 4, label: 'Fourth or greater' }], dependsOn: { isStaff: false } },
    ministryTeams: { type: Types.Relationship, ref: 'MinistryTeam', many: true },
    summerMissions: { type: Types.Relationship, ref: 'SummerMission', many: true },
    fcmId: { type: String }
    // communityGroups: { type: Types.Relationship, ref: 'CommunityGroup', many: true }
}, 'Notifications', {
    notifications: {
        ministryTeamUpdates: { type: Boolean, default: true },
        communityGroupUpdates: { type: Boolean, default: true },
        summerMissionUpdates: { type: Boolean, default: true }
    }
}, 'Permissions', {
    isAdmin: { type: Boolean, default: false, label: 'Can administer the website' },
    isVerified: { type: Boolean, default: false, label: 'Has a verified email address' }
});


/**
 Relationships
 =============
 */


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
