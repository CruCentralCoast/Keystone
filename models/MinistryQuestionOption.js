/**
 * Created by imeeder on 2/29/16.
 */

var keystone = require('keystone');

var MinistryQuestionOption = new keystone.List("MinistryQuestionOption", {
    map: { name: 'value' }
});

MinistryQuestionOption.add({
    value: { type: String, required: true, initial: true }
});

MinistryQuestionOption.defaultColumns = "value";
MinistryQuestionOption.register();
