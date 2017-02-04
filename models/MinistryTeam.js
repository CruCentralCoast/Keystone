var keystone = require('keystone');
var moment = require('moment');
var Types = keystone.Field.Types;

/**
 * MinistryTeam Model
 * ==========
 */

var MinistryTeam = new keystone.List('MinistryTeam', {
  map: { name: 'name' },
  autokey: { path: 'slug', from: 'name', unique: true }
});


var s3path = process.env.IMAGE_ROOT_PATH + '/ministry-teams';

var cacheControl = function cacheControl(item, file) {
  var headers = {};
  headers['Cache-Control'] = 'max-age=' + moment.duration(1, 'month').asSeconds();
  return headers;
};

var formatAdminUIPreview = function formatAdminUIPreview(item, file) {
  return '<pre>' + JSON.stringify(file, false, 2) + '</pre>' +
    '<img src="' + file.url + '" style="max-width: 300px">';
};

MinistryTeam.add({
  name: { type: String, required: true, initial: true },
  description: { type: Types.Textarea, initial: true },
  parentMinistry: { type: Types.Relationship, ref: 'Ministry', required: true, initial: true },
  image: {
    type: Types.S3File,
    required: false,
    allowedTypes: [
      'image/png',
      'image/jpeg',
      'image/gif'
    ],
    s3path: s3path,
    //  function with arguments current model and client file name to return the new filename to upload.
    filename: function(item, filename, originalname) {
      // prefix file name with object id
      return item.slug + '-image.' + originalname.split('.')[1].toLowerCase();
    },
    headers: cacheControl,
    format: formatAdminUIPreview
  },
  imageLink: {
    type: Types.Url,
    hidden: false,
    noedit: true,
    watch: true,
    value: function() {
      return this.image.url ? 'https:' + this.image.url : '';
    },
    format: function(url) {
      return url;
    }
  },
  teamImage: {
    type: Types.S3File,
    required: false,
    allowedTypes: [
      'image/png',
      'image/jpeg',
      'image/gif'
    ],
    s3path: s3path,
    //  function with arguments current model and client file name to return the new filename to upload.
    filename: function(item, filename, originalname) {
      // prefix file name with object id
      return item.slug + '-team-image.' + originalname.split('.')[1].toLowerCase();
    },
    headers: cacheControl,
    format: formatAdminUIPreview
  },
  teamImageLink: {
    type: Types.Url,
    hidden: false,
    noedit: true,
    watch: true,
    value: function() {
      return this.teamImage.url ? 'https:' + this.teamImage.url : '';
    },
    format: function(url) {
      return url;
    }
  },
  leaders: { type: Types.Relationship, ref: 'User', many: true }
});

MinistryTeam.relationship({ path: 'members', ref: 'User', refPath: 'ministryTeams' });

MinistryTeam.defaultColumns = 'name, parentMinistry';
MinistryTeam.register();
