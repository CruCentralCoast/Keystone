var keystone = require('keystone');
var Types = keystone.Field.Types;
var imageUtils = require('./utils/ImageUtils');

/**
 * MinistryTeam Model
 * ==========
 */

var MinistryTeam = new keystone.List('MinistryTeam', {
    map: { name: 'name' },
    autokey: { path: 'slug', from: 'name', unique: true }
});

var s3path = process.env.IMAGE_ROOT_PATH + '/ministry-teams';

MinistryTeam.add({
    name: { type: String, required: true, initial: true },
    description: { type: Types.Textarea, initial: true },
    parentMinistry: { type: Types.Relationship, ref: 'Ministry', required: true, initial: true },
    teamImage: {
        type: Types.S3File,
        required: false,
        allowedTypes: imageUtils.allowedTypes,
        s3path: s3path,
        filename: imageUtils.teamImageFileName,
        headers: imageUtils.cacheControl,
        format: imageUtils.formatAdminUIPreview
    },
    teamImageLink: {
        type: Types.Url,
        hidden: false,
        noedit: true,
        watch: true,
        value: imageUtils.teamImageLinkValue,
        format: imageUtils.imageLinkFormat
    },
    leaders: { type: Types.Relationship, ref: 'User', many: true }
});

MinistryTeam.relationship({ path: 'members', ref: 'User', refPath: 'ministryTeams' });

MinistryTeam.defaultColumns = 'name, parentMinistry';
MinistryTeam.register();
