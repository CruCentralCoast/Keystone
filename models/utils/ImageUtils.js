var keystone = require('keystone');
var moment = require('moment');

module.exports = {
   allowedImageTypes : [
      'image/png',
      'image/jpeg',
      'image/gif'
   ],
   cacheControl : function(item, file) {
      var headers = {};
      headers['Cache-Control'] = 'max-age=' + moment.duration(1, 'month').asSeconds();
      return headers;
   },
   formatAdminUIPreview : function(item, file) {
      return '<pre>' + JSON.stringify(file, false, 2) + '</pre>' +
         '<img src="' + file.url + '" style="max-width: 300px">';
   },
   // function with arguments current model and client file name to return the new filename to upload.
   fileName : function(item, filename, originalname) {
      // prefix file name with object id
      return item.slug + '.' + originalname.split('.')[1].toLowerCase();
   },
   // function with arguments current model and client file name to return the new filename to upload.
   imageFileName : function(item, filename, originalname) {
      // prefix file name with object id
      return item.slug + '-image.' + originalname.split('.')[1].toLowerCase();
   },
   // function with arguments current model and client file name to return the new filename to upload.
   squareFileName : function(item, filename, originalname) {
      // prefix file name with object id
      return item.slug + '-square.' + originalname.split('.')[1].toLowerCase();
   },
   // function with arguments current model and client file name to return the new filename to upload.
   bannerFileName : function(item, filename, originalname) {
      // prefix file name with object id
      return item.slug + '-banner.' + originalname.split('.')[1].toLowerCase();
   },
   // function with arguments current model and client file name to return the new filename to upload.
   teamImageFileName : function(item, filename, originalname) {
      // prefix file name with object id
      return item.slug + '-team-image.' + originalname.split('.')[1].toLowerCase();
   },
   // function with arguments current model and client file name to return the new filename to upload.
   groupPhotoFileName : function(item, filename, originalname) {
      // prefix file name with object id
      return item.slug + '-group-photo.' + originalname.split('.')[1].toLowerCase();
   },
   imageLinkValue : function() {
      return this.image.url ? 'https:' + this.image.url : '';
   },
   squareImageLinkValue : function() {
      return this.squareImage.url ? 'https:' + this.squareImage.url : '';
   },
   bannerImageLinkValue : function() {
      return this.bannerImage.url ? 'https:' + this.bannerImage.url : '';
   },
   teamImageLinkValue : function() {
      return this.teamImage.url ? 'https:' + this.teamImage.url : '';
   },
   groupImageLinkValue : function() {
      return this.groupImage.url ? 'https:' + this.groupImage.url : '';
   },
   imageLinkFormat : function(url) {
      return url;
   }
}