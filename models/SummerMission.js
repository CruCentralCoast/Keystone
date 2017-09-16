var keystone = require('keystone');
var Types = keystone.Field.Types;
var imageUtils = require('./utils/ImageUtils');


/**
 * Summer Mission Model
 * ==========
 */

var SummerMission = new keystone.List('SummerMission', {
  map: { name: 'name' },
  autokey: { path: 'slug', from: 'name', unique: true }
});

var s3path = process.env.IMAGE_ROOT_PATH + '/summer-missions';

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

SummerMission.add({
  name: { type: String, required: true, initial: true },
  description: { type: Types.Textarea, initial: true },
  image: {
    type: Types.File, 
    storage: s3Storage,
    filename: imageUtils.imageFileName
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
  groupImage: {
    type: Types.File, 
    storage: s3Storage,
    filename: imageUtils.groupPhotoFileName
  },
  groupImageLink: {
    type: Types.Url,
    hidden: false,
    noedit: true,
    watch: true,
    value: imageUtils.groupImageLinkValue,
    format: imageUtils.imageLinkFormat
  },
  url: { type: Types.Url },
  location: { type: Types.Location, initial: true, required: true, defaults: { country: 'USA' } },
  startDate: { type: Types.Date, default: Date.now, required: true, initial: true },
  endDate: { type: Types.Date, default: Date.now, required: true, initial: true },
  leaders: { type: Types.Text, note: 'For multiple leaders, separate names with commas' },
  cost: { type: Types.Money, initial: true }
});

SummerMission.defaultColumns = 'name, location, startDate, endDate';
SummerMission.register();
