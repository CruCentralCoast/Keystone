var keystone = require('keystone');
var Types = keystone.Field.Types;
var imageUtils = require('./utils/ImageUtils');

/**
 * Campus Model
 * ==========
 */

var Campus = new keystone.List('Campus', {
	map: { name: 'name' },
	autokey: { path: 'slug', from: 'name', unique: true },
	singular: 'Campus',
	plural: 'Campuses'
});

var s3path = process.env.IMAGE_ROOT_PATH + '/campuses';

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

Campus.add({
	name: { type: String, required: true },
	location: { type: Types.Location, initial: true, required: true, defaults: { country: 'USA' } },
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
    filename: imageUtils.squareFileName,
  },
  squareImageLink: {
    type: Types.Url,
    hidden: false,
    noedit: true,
    watch: true,
    value: imageUtils.squareImageLinkValue,
    format: imageUtils.imageLinkFormat
  },
  bannerImage: {
    type: Types.File, 
    storage: s3Storage,
    filename: imageUtils.bannerFileName
  },
  bannerImageLink: {
    type: Types.Url,
    hidden: false,
    noedit: true,
    watch: true,
    value: imageUtils.bannerImageLinkValue,
    format: imageUtils.imageLinkFormat
  },	
  url: { type: Types.Url }
});

Campus.relationship({ path: 'ministries', ref: 'Ministry', refPath: 'campuses' });

Campus.defaultColumns = 'name, location, url, imageLink';
Campus.register();
