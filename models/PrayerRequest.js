var keystone = require('keystone');
var Types = keystone.Field.Types;
var validators = require('mongoose-validators');

/**
 * PrayerRequest Model
 * ==========
 */

var PrayerRequest = new keystone.List('PrayerRequest', {
   defaultSort: '-createdAt'
});

PrayerRequest.add({
   fcm_id: { type: String, required: true, initial: true, hidden: true },
   createdAt: { type: Date, default: Date.now, noedit: true },
   leadersOnly: { type: Types.Boolean, noedit: true, initial: true, note: 'Whether the prayer request will only be visible to leaders or will be visible to everyone' },
   genderPreference: { type: Types.Select, options: [ { value: 1, label: 'Male' }, { value: 2, label: 'Female' }, { value: 9, label: 'No Preference' } ], initial: true, dependsOn: { leadersOnly: [true] } },
   contact: { type: Types.Boolean, noedit: true, initial: true, dependsOn: { leadersOnly: [true] }, note: 'Whether the author would like to be personally contacted by a leader' },
   contactLeader: { type: Types.Relationship, ref: 'User', dependsOn: { contact: [true] } },
   contacted: { type: Types.Boolean, dependsOn: { contact: [true] }, note: 'Whether the author has been personally contacted by the Contact Leader' },
   contactEmail: { type: Types.Email, initial: true, dependsOn: { contact: [true] } },
   contactPhone: { type: String, initial: true, dependsOn: { contact: [true] }, validate: [validators.isNumeric(), validators.isLength(10)] },
   prayerResponse: { type: Types.Relationship, ref: 'PrayerResponse', many: true },
   prayer: { type: String, required: true, initial: true, noedit: true }
});

PrayerRequest.defaultColumns = 'createdAt, prayer, leadersOnly, genderPreference, contact, contactLeader, contacted, contactInfo';
PrayerRequest.register();
