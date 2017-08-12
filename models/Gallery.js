var keystone = require('keystone');
var Types = keystone.Field.Types;

var Gallery = new keystone.List('Gallery', {
	autokey: { from: 'name', path: 'key', unique: true },
	plural: 'Albums',
	singular: 'Album',
  	hidden: true
});

Gallery.add({
	name: { type: String, required: true },
	publishedDate: { type: Types.Date, default: Date.now },
});

Gallery.track = true;
Gallery.defaultSort = 'name';
Gallery.defaultColumns = 'name, publishedDate';
Gallery.register();
