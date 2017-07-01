var keystone = require('keystone');
var Types = keystone.Field.Types;

var ResourcePage = new keystone.List('ResourcePage', {
	map: {name: 'title'},
	autokey: { path: 'slug', from: 'title', unique: true },
	singular: 'ResourcePage',
	plural: 'ResourcePages',
  	defaultSort: '-createdAt'
});

ResourcePage.add({
	title: { type: String, required: true },
	state: { type: Types.Select, options: 'draft, published, archived', default: 'draft', index: true },
	author: { type: Types.Text, index: true },
	publishedDate: { type: Types.Date, index: true },
	content: { type: Types.Html, wysiwyg: true, height: 350 },
	tags: { type: Types.Relationship, ref: 'ResourceTag', many: true }
});

ResourcePage.track = true;
ResourcePage.defaultColumns = 'name, state|20%, author|20%, publishedDate|20%';
ResourcePage.register();
