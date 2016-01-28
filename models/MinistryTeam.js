var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * MinistryTeam Model
 * ==========
 */

var MinistryTeam = new keystone.List('MinistryTeam', {
	map: { name: 'name' },
	autokey: { path: 'slug', from: 'name', unique: true }
});

MinistryTeam.add({
	name: { type: String, required: true, initial: true },
	description: { type: Types.Textarea, initial: true },
	image: { type: Types.CloudinaryImage },
	parentMinistry: { type: Types.Relationship, ref: 'Ministry', required: true, initial: true }
});

MinistryTeam.relationship({ path: 'members', ref: 'User', refPath: 'ministryTeams' });

MinistryTeam.defaultColumns = 'name, parentMinistry';
MinistryTeam.register();
