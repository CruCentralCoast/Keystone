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
	image: { type: Types.S3File,
           required: false,
           allowedTypes: [
             'image/png',
             'image/jpeg',
             'image/gif'
           ],
           s3path: process.env.IMAGE_ROOT_PATH + '/campuses',
           //  function with arguments current model and client file name to return the new filename to upload.
           filename: function(item, filename, originalname) {
		         // prefix file name with object id
		         return item.slug + '.' + originalname.split('.')[1].toLowerCase();
	         },
           headers: function(item, file) {
		         var headers = {};
		         headers['Cache-Control'] = 'max-age=' + moment.duration(1, 'month').asSeconds();
		         return headers;
	         },
           format: function(item, file) {
		         return '<pre>' + JSON.stringify(file, false, 2) + '</pre>' +
					     '<img src="' + file.url + '" style="max-width: 300px">';
	         }
  },
  imageLink: {
    type: Types.Url,
    hidden: false,
    noedit: true,
    watch: true,
    value: function() {
      console.log(this.image.url);
      return 'https:' + this.image.url;
    },
    format: function(url) {
      console.log(url);
      return url;
    }
  },
	url: { type: Types.Url }
});

Campus.relationship({ path: 'ministries', ref: 'Ministry', refPath: 'campuses' });

Campus.defaultColumns = 'name, location, url, imageLink';
Campus.register();
