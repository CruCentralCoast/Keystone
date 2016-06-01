var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Resource Model
 * ==========
 */

var Resource = new keystone.List('Resource', {
	map: { name: 'title' },
	autokey: { path: 'slug', from: 'title', unique: true },
	singular: 'Resource',
	plural: 'Resources'
});

Resource.add({
	url: { type: Types.Url, required: true, initial: true },
	type: { type: Types.Select, emptyOption: false, initial: true, required: true, numeric: false, options: ['article', 'audio', 'video'] },
	date: { type: Types.Date, yearRange: [2000, 2030] },
	title: { type: Types.Text, initial: true, required: true},
  restricted: { type: Types.Boolean, initial: true, required: true, note: 'Whether the resource is only for leaders' },
	tags: { type: Types.Relationship, initial: true, required: false, ref: 'ResourceTag', many: true }
});

Resource.relationship({ path: 'tags', ref: 'ResourceTag', refPath: 'title' });

Resource.defaultColumns = 'title, type, url, date, tags';
Resource.register();
