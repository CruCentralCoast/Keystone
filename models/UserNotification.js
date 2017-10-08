var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Notification Model
 * =============
 */

var UserNotification = new keystone.List('UserNotification', {
    defaultSort: "time"
});

UserNotification.add({
    title: { type: String, required: false, initial: false},
    body: { type: String, required: true, initial: true },
    subTitle: { type: String, required: false, initial: false },
    time: { type: Types.Datetime, required: true, initial: true, default: Date.now },
    sent: { type: Types.Boolean, initial: true, default: false },
    user: { type: Types.Relationship, initial: true, ref: 'User'}
});

UserNotification.defaultColumns = 'body, sent, time, user';
UserNotification.register();
