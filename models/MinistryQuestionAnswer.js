/**
 * Created by imeeder on 2/29/16.
 */

var keystone = require('keystone'),
	Types = keystone.Field.Types;

var MinistryQuestionAnswer = keystone.List('MinistryQuestionAnswer', {
	
});

MinistryQuestionAnswer.add({
	question: { type: Types.Relationship, ref: 'MinistryQuestion', required: true, initial: true},
	communityGroup: { type: Types.Relationship, ref: 'CommunityGroup', required: true, initial: true, many: true},
	answer: { type: String, required: true, initial: true }
});

MinistryQuestionAnswer.defaultColumns = "question, ministryTeam, answer";
MinistryQuestionAnswer.register();
