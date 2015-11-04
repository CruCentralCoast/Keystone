var keystone = require('keystone');
var Types = keystone.Field.Types;

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
	image: { type: Types.CloudinaryImage },
  url: { type: Types.Url, initial: true, note: 'A link to the sign up page'},
  location: { type: Types.Location, initial: true, required: true, defaults: { country: 'USA' } },
	startDate: { type: Types.Datetime, default: Date.now(), required: true, initial: true },
  endDate: { type: Types.Datetime, default: Date.now(), required: true, initial: true },
  rideSharingEnabled: { type: Types.Boolean, default: false, label: 'Does this event have ride sharing?' },
  parentMinistry: { type: Types.Relationship, ref: 'Ministry', label: 'Which ministry is this event for?' },
	notificationDate: { type: Types.Datetime, label: 'Date to notify attendees' }
});

Event.defaultColumns = 'name, location, startDate, endDate';
Event.register();
