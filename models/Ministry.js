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


Ministry.add({
  name: { type: String, required: true, initial: true },
  description: { type: Types.Textarea, initial: true },
  teams: { type: Types.Relationship, ref: 'MinistryTeam', many: true },
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
  squareImage: {
    type: Types.S3File,
    required: false,
    allowedTypes: imageUtils.allowedTypes,
    s3path: s3path,
    filename: imageUtils.squareFileName,
    headers: imageUtils.cacheControl,
    format: imageUtils.formatAdminUIPreview
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
    type: Types.S3File,
    required: false,
    allowedTypes: imageUtils.allowedTypes,
    s3path: s3path,
    filename: imageUtils.bannerFileName,
    headers: imageUtils.cacheControl,
    format: imageUtils.formatAdminUIPreview
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
