var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Summer Mission Model
 * ==========
 */

var SummerMission = new keystone.List('SummerMission', {
	map: { name: 'name' },
	autokey: { path: 'slug', from: 'name', unique: true }
});

SummerMission.add({
	name: { type: String, required: true, initial: true },
	description: { type: Types.Textarea, initial: true },
	image: { type: Types.CloudinaryImage },
  url: { type: Types.Url },
  location: { type: Types.Location, initial: true, required: true, defaults: { country: 'USA' } },
	startDate: { type: Types.Date, format: 'MMM Do YYYY', default: Date.now, required: true, initial: true },
  endDate: { type: Types.Date, format: 'MMM Do YYYY', default: Date.now, required: true, initial: true },
	leaders: { type: Types.Relationship, ref: 'User', many: true },
	cost: { type: Types.Money, initial: true }
});

SummerMission.defaultColumns = 'name, location, startDate, endDate';
SummerMission.register();
