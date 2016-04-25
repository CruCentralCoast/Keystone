var keystone = require('keystone');
var Types = keystone.Field.Types;
var moment = require('moment');
moment().format();

/**
 * Event Model
 * ==========
 */

var Event = new keystone.List('Event', {
	map: { name: 'name' },
	autokey: { path: 'slug', from: 'name', unique: true }
});

Event.add({
	name: { type: String, required: true, initial: true },
	description: { type: Types.Textarea, initial: true },
	image: { type: Types.S3File,
           required: false,
           allowedTypes: [
             'image/png',
             'image/jpeg',
             'image/gif'
           ],
           s3path: process.env.IMAGE_ROOT_PATH + '/events',
           //  function with arguments current model and client file name to return the new filename to upload.
           filename: function(item, filename, originalname) {
		         // prefix file name with object id
		         return item.slug + '.' + originalname.split('.')[1].toLowerCase();
	         },
           headers: function(item, file) {
		         var headers = {};
		         headers['Cache-Control'] = 'max-age=' + moment.duration(1, 'month').asSeconds();
		         return headers;
	         },
           format: function(item, file) {
		         return '<pre>' + JSON.stringify(file, false, 2) + '</pre>' +
					     '<img src="' + file.url + '" style="max-width: 300px">';
	         }
  },
  imageLink: {
    type: Types.Url,
    hidden: false,
    noedit: true,
    watch: true,
    value: function() {
      return this.image.url;
    },
    format: function(url) {
      return url;
    }
  },
  url: { type: Types.Url, initial: true, note: 'A link to the sign up page'},
  location: { type: Types.Location, initial: true, required: true, defaults: { country: 'USA' } },
	startDate: { type: Types.Datetime, format: 'MMM Do YYYY hh:mm a', default: Date.now(), required: true, initial: true },
    endDate: { type: Types.Datetime, format: 'MMM Do YYYY hh:mm a', default: Date.now(), required: true, initial: true },
    rideSharing: { type: Types.Boolean, default: false, label: 'Does this event have ride sharing?' },
    ministries: { type: Types.Relationship, ref: 'Ministry', label: 'Which ministries is this event for?', many: true },
    notifications: { type: Types.Relationship, ref: 'Notification', label: 'These are the notifications being sent for this event', many: true }
});

Event.defaultColumns = 'name, location, startDate, endDate, imageLink';
Event.register();
