var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * PrayerResponse Model
 * ==========
 */

var PrayerResponse = new keystone.List('PrayerResponse', {
   defaultSort: '-createdAt'
});

PrayerResponse.add({
   gcm_id: { type: String, required: true, initial: true, hidden: true },
   createdAt: { type: Date, default: Date.now, noedit: true },
   response: { type: String, required: true, initial: true, noedit: true }
});

PrayerResponse.defaultColumns = 'createdAt, response';
PrayerResponse.register();
