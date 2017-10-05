var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * ResourceTag Model
 * ==========
 */

var ResourceTag = new keystone.List('ResourceTag', {
    map: { name: 'title' },
    autokey: { path: 'slug', from: 'title', unique: true },
    singular: 'Resource Tag',
    plural: 'Resource Tags'
});

ResourceTag.add({
    title: { type: String, required: true, initial: true },
    resources: { type: Types.Relationship, ref: 'Resource', many: true }
});

ResourceTag.relationship({ path: 'tagged', ref: 'Resource', refPath: 'tags' });

ResourceTag.register();
