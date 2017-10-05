var keystone = require('keystone');
var Types = keystone.Field.Types;
var imageUtils = require('./utils/ImageUtils');

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

var s3path = process.env.IMAGE_ROOT_PATH + '/campuses';

Campus.add({
    name: { type: String, required: true },
    location: { type: Types.Location, initial: true, required: true, defaults: { country: 'USA' } },
    image: {
        type: Types.S3File,
        required: false,
        allowedTypes: imageUtils.allowedTypes,
        s3path: s3path,
        filename: imageUtils.fileName,
        headers: imageUtils.cacheControl,
        format: imageUtils.formatAdminUIPreview
    },
    imageLink: {
        type: Types.Url,
        hidden: false,
        noedit: true,
        watch: true,
        value: imageUtils.imageLinkValue,
        format: imageUtils.imageLinkFormat
    },
    squareImage: {
        type: Types.S3File,
        required: false,
        allowedTypes: imageUtils.allowedTypes,
        s3path: s3path,
        filename: imageUtils.squareFileName,
        headers: imageUtils.cacheControl,
        format: imageUtils.formatAdminUIPreview
    },
    squareImageLink: {
        type: Types.Url,
        hidden: false,
        noedit: true,
        watch: true,
        value: imageUtils.squareImageLinkValue,
        format: imageUtils.imageLinkFormat
    },
    bannerImage: {
        type: Types.S3File,
        required: false,
        allowedTypes: imageUtils.allowedTypes,
        s3path: s3path,
        filename: imageUtils.bannerFileName,
        headers: imageUtils.cacheControl,
        format: imageUtils.formatAdminUIPreview
    },
    bannerImageLink: {
        type: Types.Url,
        hidden: false,
        noedit: true,
        watch: true,
        value: imageUtils.bannerImageLinkValue,
        format: imageUtils.imageLinkFormat
    },
    url: { type: Types.Url }
});

Campus.relationship({ path: 'ministries', ref: 'Ministry', refPath: 'campuses' });

Campus.defaultColumns = 'name, location, url, imageLink';
Campus.register();
