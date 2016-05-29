var keystone = require('keystone');
var Types = keystone.Field.Types;

var ResourcePage = new keystone.List('ResourcePage', {
	autokey: { from: 'title', path: 'slug', unique: true },
  map: {name: 'title'},
  defaultSort: '-createdAt'
});

ResourcePage.add({
	title: { type: String, required: true },
	state: { type: Types.Select, options: 'draft, published, archived', default: 'draft', index: true },
	author: { type: Types.Relationship, ref: 'User', index: true },
	publishedDate: { type: Types.Date, index: true },
	content: {
		type: Types.Html, wysiwyg: true, height: 350
	},
  isPrivate: { type: Types.Boolean, label: 'Private Resource?', required: true },
	tags: { type: Types.Relationship, ref: 'ResourceTag', many: true }
});

ResourcePage.track = true;
ResourcePage.defaultColumns = 'name, state|20%, author|20%, publishedDate|20%';
ResourcePage.register();
