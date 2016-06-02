var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * MinistryQuestion Model
 * ==========
 */

var MinistryQuestion = new keystone.List('MinistryQuestion', {
	map: { name : 'question' }
});

MinistryQuestion.add({
  ministry : { type: Types.Relationship, ref: 'Ministry', initial: true, many: true },
	question: { type: String, required: true, initial: true },
  type: { type: Types.Select, options: "text, select, datetime", initial: true },
	selectOptions: { type: Types.Relationship, ref: 'MinistryQuestionOption', many: true }
});

MinistryQuestion.defaultColumns = 'ministry, question, type, selectOptions';
MinistryQuestion.register();
