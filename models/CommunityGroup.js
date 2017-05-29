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
	meetingTime: { 
		type: Types.Select, 
		initial: true, 
		options: '6:00am, 6:30am, 7:00am, 7:30am, 8:00am, 8:30am, 9:00am, 9:30am, 10:00am, 10:30am, 11:00am, 11:30am, 12:00pm, 12:30pm, 1:00pm, 1:30pm, 2:00pm, 2:30pm, 3:00pm, 3:30pm, 4:00pm, 4:30pm, 5:00pm, 5:30pm, 6:00pm, 6:30pm, 7:00pm, 7:30pm, 8:00pm, 8:30pm, 9:00pm, 9:30pm, 10:00pm'},
    dayOfWeek: { type: Types.Select, initial: true, options: 'Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday'},
    type: { type: Types.Select, required: true, initial: true, emptyOption: false, options: 'Freshmen, Sophomore, Junior, Senior, Graduate, Faculty, Mixed Ages, Mixed Sexes' },
    leaders: { type: Types.Relationship, ref: 'User', many: true },
	ministry: { type: Types.Relationship, ref: 'Ministry', initial: true },
	answers: {type: Types.Relationship, path: 'answers', ref: 'MinistryQuestionAnswer', refPath: 'ministry'}
});

console.log("Time: " + CommunityGroup.meetingTime);

//CommunityGroup.relationship({ path: 'answers', ref: 'MinistryQuestionAnswer', refPath: 'ministry'});

CommunityGroup.defaultColumns = 'name, leaders, type';
CommunityGroup.register();
