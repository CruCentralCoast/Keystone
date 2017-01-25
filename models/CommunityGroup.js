var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * CommunityGroup Model
 * ==========
 */

//TODO this model is crap, missing tons of info. Come back to it later

var CommunityGroup = new keystone.List('CommunityGroup', {
	map: { name: 'name' },
	autokey: { path: 'slug', from: 'leaders', unique: true }
});

CommunityGroup.add({
	name: { type: String, required: true, initial: true },
    description: { type: String, initial: true },
	meetingTime: { label: 'Meeting Time (Ignore Date)',type: Date, initial: true},
    dayOfWeek: { type: Types.Select, initial: true, options: 'Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday'},
    type: { type: Types.Select, required: true, initial: true, emptyOption: false, options: 'Freshmen, Sophomore, Junior, Senior, Graduate, Faculty, Mixed Ages, Mixed Sexes' },
    leaders: { type: Types.Relationship, ref: 'User', many: true },
	ministry: { type: Types.Relationship, ref: 'Ministry', initial: true }
});

CommunityGroup.relationship({ path: 'answers', ref: 'MinistryQuestionAnswer', refPath: 'ministry'});

CommunityGroup.defaultColumns = 'name, leaders, type';
CommunityGroup.register();
