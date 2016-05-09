var keystone = require('keystone');
var Types = keystone.Field.Types;
var moment = require('moment');


/**
 * Summer Mission Model
 * ==========
 */

var SummerMission = new keystone.List('SummerMission', {
  map: { name: 'name' },
  autokey: { path: 'slug', from: 'name', unique: true }
});


var s3path = process.env.IMAGE_ROOT_PATH + '/summer-missions';

var cacheControl = function cacheControl(item, file) {
  var headers = {};
  headers['Cache-Control'] = 'max-age=' + moment.duration(1, 'month').asSeconds();
  return headers;
};

var formatAdminUIPreview = function formatAdminUIPreview(item, file) {
  return '<pre>' + JSON.stringify(file, false, 2) + '</pre>' +
    '<img src="' + file.url + '" style="max-width: 300px">';
};

SummerMission.add({
  name: { type: String, required: true, initial: true },
  description: { type: Types.Textarea, initial: true },
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
  groupImage: {
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
      return item.slug + '-group-photo.' + originalname.split('.')[1].toLowerCase();
    },
    headers: cacheControl,
    format: formatAdminUIPreview
  },
  groupImageLink: {
    type: Types.Url,
    hidden: false,
    noedit: true,
    watch: true,
    value: function() {
      return this.groupImage.url ? 'https:' + this.groupImage.url : '';
    },
    format: function(url) {
      return url;
    }
  },
  url: { type: Types.Url },
  location: { type: Types.Location, initial: true, required: true, defaults: { country: 'USA' } },
  startDate: { type: Types.Date, format: 'MMM Do YYYY', default: Date.now, required: true, initial: true },
  endDate: { type: Types.Date, format: 'MMM Do YYYY', default: Date.now, required: true, initial: true },
  leaders: { type: Types.Text, note: 'For multiple leaders, separate names with commas' },
  cost: { type: Types.Money, initial: true }
});

SummerMission.defaultColumns = 'name, location, startDate, endDate';
SummerMission.register();
