var keystone = require('keystone');
var Types = keystone.Field.Types;
var imageUtils = require('./utils/ImageUtils');

/**
 * Ministry Model
 * ==========
 */

var Ministry = new keystone.List('Ministry', {
  map: { name: 'name' },
  autokey: { path: 'slug', from: 'name', unique: true }
});

var s3path = process.env.IMAGE_ROOT_PATH + '/ministries';

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

Ministry.add({
  name: { type: String, required: true, initial: true },
  description: { type: Types.Textarea, initial: true },
  teams: { type: Types.Relationship, ref: 'MinistryTeam', many: true },
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
  campus: { type: Types.Relationship, ref: 'Campus', initial: true, default: ''}
});

Ministry.relationship({ path: 'teams', ref: 'MinistryTeam', refPath: 'parentMinistry' });

Ministry.defaultColumns = 'name, teams, campuses, imageLink';
Ministry.register();
