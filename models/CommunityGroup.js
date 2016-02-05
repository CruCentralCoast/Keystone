var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * CommunityGroup Model
 * ==========
 */


var CommunityGroup = new keystone.List('CommunityGroup', {
	map: { name: 'name' },
	autokey: { path: 'slug', from: 'leaders', unique: true }
});

CommunityGroup.add({
	name: { type: String, required: true, initial: true },
	meetingTime: { type: Types.Textarea, initial: true },
  leaders: { type: Types.Relationship, ref: 'User', many: true },
	type: { type: Types.Select, required: true, initial: true, emptyOption: false, options: 'Freshmen, Sophomore, Junior, Senior, Graduate, Faculty, Mixed Ages, Mixed Sexes' },
	parentMinistry: { type: Types.Relationship, ref: 'Ministry', initial: true }
});

CommunityGroup.defaultColumns = 'name, leaders, type';
CommunityGroup.register();
