var keystone = require('keystone');
var Types = keystone.Field.Types;
var imageUtils = require('./utils/ImageUtils');

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

var s3Storage = new keystone.Storage({
  adapter: require('keystone-storage-adapter-s3'),
  s3: {
    required: false,
    allowedTypes: imageUtils.allowedTypes,
    path: s3path,
    headers: imageUtils.cacheControl,
    format: imageUtils.formatAdminUIPreview
  },
});

Resource.add({
	url: { type: Types.Url, required: true, initial: true },
	type: { type: Types.Select, emptyOption: false, initial: true, required: true, numeric: false, options: ['article', 'audio', 'video'] },
	date: { type: Types.Date, yearRange: [2000, 2030] },
	title: { type: Types.Text, initial: true, required: true },
	author: {type: Types.Text, initial: true, required: true },
	description: { type: Types.Textarea, initial: true },
   restricted: { type: Types.Boolean, initial: true, required: true, note: 'Whether the resource is only for leaders' },
   image: {
   		type: Types.File, 
    	storage: s3Storage,
		filename: imageUtils.fileName
  	},
	imageLink: {
		type: Types.Url,
		hidden: false,
		noedit: true,
		watch: true,
		value: imageUtils.imageLinkValue,
		format: imageUtils.imageLinkFormat
	},
	squareImage: {
		type: Types.File, 
    	storage: s3Storage,
		filename: imageUtils.squareFileName
	},
	squareImageLink: {
		type: Types.Url,
		hidden: false,
		noedit: true,
		watch: true,
		value: imageUtils.squareImageLinkValue,
		format: imageUtils.imageLinkFormat
	},
	tags: { type: Types.Relationship, initial: true, required: false, ref: 'ResourceTag', many: true }
});

Resource.relationship({ path: 'tags', ref: 'ResourceTag', refPath: 'title' });

Resource.defaultColumns = 'title, type, url, date, tags';
Resource.register();
