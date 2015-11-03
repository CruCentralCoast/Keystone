var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Ministry Model
 * ==========
 */

var Ministry = new keystone.List('Ministry', {
	map: { name: 'name' },
	autokey: { path: 'slug', from: 'name', unique: true }
});

Ministry.add({
	name: { type: String, required: true },
	description: { type: Types.Textarea, required: true },
	image: { type: Types.CloudinaryImage },
	campus: { type: Types.Relationship, ref: 'Campus', required: true }
});

Ministry.defaultColumns = 'name, campus';
Ministry.register();
