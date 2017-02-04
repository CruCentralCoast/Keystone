var keystone = require('keystone');
var moment = require('moment');
var Types = keystone.Field.Types;

/**
 * Ministry Model
 * ==========
 */

var Ministry = new keystone.List('Ministry', {
  map: { name: 'name' },
  autokey: { path: 'slug', from: 'name', unique: true }
});

var s3path = process.env.IMAGE_ROOT_PATH + '/ministries';

var cacheControl = function cacheControl(item, file) {
  var headers = {};
  headers['Cache-Control'] = 'max-age=' + moment.duration(1, 'month').asSeconds();
  return headers;
};

var formatAdminUIPreview = function formatAdminUIPreview(item, file) {
  return '<pre>' + JSON.stringify(file, false, 2) + '</pre>' +
    '<img src="' + file.url + '" style="max-width: 300px">';
};


Ministry.add({
  name: { type: String, required: true, initial: true },
  description: { type: Types.Textarea, initial: true },
  teams: { type: Types.Relationship, ref: 'MinistryTeam', many: true },
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
      return item.slug + '.' + originalname.split('.')[1].toLowerCase();
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
  squareImage: {
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
      return item.slug + '-square.' + originalname.split('.')[1].toLowerCase();
    },
    headers: cacheControl,
    format: formatAdminUIPreview
  },
  squareImageLink: {
    type: Types.Url,
    hidden: false,
    noedit: true,
    watch: true,
    value: function() {
      return this.squareImage.url ? 'https:' + this.squareImage.url : '';
    },
    format: function(url) {
      return url;
    }
  },
  bannerImage: {
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
      return item.slug + '-banner.' + originalname.split('.')[1].toLowerCase();
    },
    headers: cacheControl,
    format: formatAdminUIPreview
  },
  bannerImageLink: {
    type: Types.Url,
    hidden: false,
    noedit: true,
    watch: true,
    value: function() {
      return this.bannerImage.url ? 'https:' + this.bannerImage.url : '';
    },
    format: function(url) {
      return url;
    }
  },
  campus: { type: Types.Relationship, ref: 'Campus', initial: true, default: ''}
});

Ministry.relationship({ path: 'teams', ref: 'MinistryTeam', refPath: 'parentMinistry' });

Ministry.defaultColumns = 'name, teams, campuses, imageLink';
Ministry.register();
