var keystone = require('keystone');
var Types = keystone.Field.Types;

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

Campus.add({
	name: { type: String, required: true },
	location: { type: Types.Location, initial: true, required: true, defaults: { country: 'USA' } },
  image: { type: Types.CloudinaryImage, autoCleanup: true, select: true, initial: false, required: false },
	url: { type: Types.Url }
});

Campus.relationship({ path: 'ministries', ref: 'Ministry', refPath: 'campuses' });

Campus.defaultColumns = 'name, location, url';
Campus.register();
