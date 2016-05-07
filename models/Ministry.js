var keystone = require('keystone');
var moment = require('moment');
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
	name: { type: String, required: true, initial: true },
	description: { type: Types.Textarea, initial: true },
	teams: { type: Types.Relationship, ref: 'MinistryTeam', many: true },
	image: { type: Types.S3File,
           required: false,
           allowedTypes: [
             'image/png',
             'image/jpeg',
             'image/gif'
           ],
           s3path: process.env.IMAGE_ROOT_PATH + '/ministries',
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
      return this.image.url;
    },
    format: function(url) {
      console.log(url);
      return url;
    }
  },
	campus: { type: Types.Relationship, ref: 'Campus', initial: true, default: ''}
});

Ministry.relationship({ path: 'teams', ref: 'MinistryTeam', refPath: 'parentMinistry' });

Ministry.defaultColumns = 'name, teams, campuses, imageLink';
Ministry.register();
