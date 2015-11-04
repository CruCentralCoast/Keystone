var keystone = require('keystone');
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
	image: { type: Types.CloudinaryImage },
	teams: { type: Types.Relationship, ref: 'MinistryTeam', many: true },
	campuses: { type: Types.Relationship, ref: 'Campus', initial: true, many: true }
});

Ministry.relationship({ path: 'teams', ref: 'MinistryTeam', refPath: 'parentMinistry' });

Ministry.defaultColumns = 'name, teams, campuses';
Ministry.register();
