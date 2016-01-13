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
	url: { type: Types.Url, required: true },
	type: { type: Types.Select, emptyOption: false, initial: true, required: true, numeric: false, ['article', 'audio', 'video'] },
	date: { type: Types.Date, yearRange: [2000, 2030] },
	title: { type: Types.Text, initial: true, required: true}
});

Resource.relationship({ path: 'tags', ref: 'ResourceTag', refPath: 'title' });

Resource.defaultColumns = 'title, type, url, date, tags';
Resource.register();
