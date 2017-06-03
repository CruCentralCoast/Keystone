var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Passenger Model
 * ==========
 */

var Passenger = new keystone.List('Passenger', {
});

Passenger.add({
    name: { label: 'Name', type: String, initial: true, required: true },
    phone: { label: 'Phone', type: String, initial: true, required: true },
    gcm_id: { type: String, hidden: true },
    direction: { label: 'Direction', type: Types.Select, options: 'to, from, both', required: true, initial: true},
    gender_pref: { label: 'Gender Preference', type: Types.Select, numeric: true, emptyOption: true, options: [{ value: 0, label: 'Unknown' }, { value: 1, label: 'Male' }, { value: 2, label: 'Female' }, { value: 9, label: 'Not Applicable' }] },
    event: { label: 'Event', type: Types.Relationship, ref: 'Event', initial: true, required: true},
    has_driver: { label: 'Has Driver?', type: Boolean, initial: false, default: false }
});

Passenger.defaultColumns = 'name, phone, direction';
Passenger.register();
