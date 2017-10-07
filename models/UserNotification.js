var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Notification Model
 * =============
 */

var Notification = new keystone.List('UserNotification', {
    defaultSort: "time"
});

Notification.add({
    title: { type: String, required: true, initial: false},
    message: { type: String, required: true, initial: true },
    time: { type: Types.Datetime, required: true, initial: true, default: Date.now },
    sent: { type: Types.Boolean, initial: true, default: false },
    user: { type: Types.Relationship, initial: true, ref: 'User', label: 'Ministries to send to (none = everyone)' }
});

Notification.defaultColumns = 'message, sent, time, ministries';
Notification.register();
