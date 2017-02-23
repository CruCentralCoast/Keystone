var keystone = require('keystone');
var Types = keystone.Field.Types;
var moment = require('moment');

/**
 * Resource Model
 * ==========
 */

var Resource = new keystone.List('Resource', {
	map: { name: 'title' },
	autokey: { path: 'slug', from: 'title', unique: true },
	singular: 'Resource',
	plural: 'Resources'
});

var s3path = process.env.IMAGE_ROOT_PATH + '/resources';

var cacheControl = function cacheControl(item, file) {
  var headers = {};
  headers['Cache-Control'] = 'max-age=' + moment.duration(1, 'month').asSeconds();
  return headers;
};

var formatAdminUIPreview = function formatAdminUIPreview(item, file) {
  return '<pre>' + JSON.stringify(file, false, 2) + '</pre>' +
    '<img src="' + file.url + '" style="max-width: 300px">';
};

Resource.add({
	url: { type: Types.Url, required: true, initial: true },
	type: { type: Types.Select, emptyOption: false, initial: true, required: true, numeric: false, options: ['article', 'audio', 'video'] },
	date: { type: Types.Date, yearRange: [2000, 2030] },
	title: { type: Types.Text, initial: true, required: true},
	author: {type: Types.Text, initial: true, required: true},
	description: { type: Types.Textarea, initial: true},
   restricted: { type: Types.Boolean, initial: true, required: true, note: 'Whether the resource is only for leaders' },
   image: {
   	type: Types.S3File,
    	required: false,
   	allowedTypes: [
	      'image/png',
	      'image/jpeg',
	      'image/gif'
   	],
    	s3path: s3path,
    	// function with arguments current model and client file name to return the new filename to upload.
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
		// function with arguments current model and client file name to return the new filename to upload.
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
		// function with arguments current model and client file name to return the new filename to upload.
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
	tags: { type: Types.Relationship, initial: true, required: false, ref: 'ResourceTag', many: true }
});

Resource.relationship({ path: 'tags', ref: 'ResourceTag', refPath: 'title' });

Resource.defaultColumns = 'title, type, url, date, tags';
Resource.register();
