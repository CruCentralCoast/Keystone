var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Campus Model
 * ==========
 */

var Campus = new keystone.List('Campus', {
	map: { name: 'name' },
	autokey: { path: 'slug', from: 'name', unique: true }
});

Campus.add({
	name: { type: String, required: true },
	location: { type: Types.Location, required: true, defaults: { country: 'USA' } },
	url: { type: Types.Url }
});

Campus.defaultColumns = 'name, campus';
Campus.register();
