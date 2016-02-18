var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * MinistryQuestion Model
 * ==========
 */

var MinistryQuestion = new keystone.List('MinistryQuestion');

MinistryQuestion.add({
    ministry : { type: Types.Relationship, ref: 'Ministry', initial: true},
	question: { type: String, required: true, initial: true },
    type: { type: Select, options: ["text", "time", "weekday", "gender"], initial: true }
});

MinistryQuestion.defaultColumns = 'name, leaders';
MinistryQuestion.register();
