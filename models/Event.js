var keystone = require('keystone');
var Types = keystone.Field.Types;
var imageUtils = require('./utils/ImageUtils');

/**
 * Event Model
 * ==========
 */

var Event = new keystone.List('Event', {
  map: { name: 'name' },
  autokey: { path: 'slug', from: 'name', unique: true }
});

var s3path = process.env.IMAGE_ROOT_PATH + '/events';

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

console.log(s3path);

// the separate properties for each imageLink are necessary because in the version of keystone
// these models were created under, the 'format' properties on s3files is broken, so the html is
// not rendered in the admin UI. Eventually this may be fixed.
Event.add({
	name: { type: String, required: true, initial: true },
  description: { type: Types.Textarea, initial: true },
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
  url: { type: Types.Url, initial: true, note: 'A link to the sign up page'},
  location: { type: Types.Location, initial: true, required: true, defaults: { country: 'USA' } },
  startDate: { type: Types.Datetime, format: 'MMM Do YYYY hh:mm a', required: true, initial: true },
  endDate: { type: Types.Datetime, format: 'MMM Do YYYY hh:mm a', required: true, initial: true },
  rideSharing: { type: Types.Boolean, default: false, label: 'Does this event have ride sharing?' },
  ministries: { type: Types.Relationship, ref: 'Ministry', label: 'Which ministries is this event for?', many: true },
  notifications: { type: Types.Relationship, ref: 'Notification', label: 'These are the notifications being sent for this event', many: true },
}, 'Display Options', {
  displayOnWebsite: { type: Types.Boolean, default: false, label: 'Is this event ready to display on the website?' },
  displayOnApp: { type: Types.Boolean, default: false, label: 'Is this event ready to display on the app?' }
});

Event.defaultColumns = 'name, location, startDate, endDate, imageLink';
Event.register();
