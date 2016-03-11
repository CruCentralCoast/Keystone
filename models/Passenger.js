var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Passenger Model
 * ==========
 */

var Passenger = new keystone.List('Passenger', {
});

Passenger.add({
    name: { type: String, initial: true, required: true },
    phone: { type: String, initial: true, required: true },
    gcm_id: { type: String },
    direction: { type: Types.Select, options: 'to, from, both', required: true, initial: true},
    gender: { type: Types.Select, numeric: true, emptyOption: false, options: [{ value: 0, label: 'Unknown' }, { value: 1, label: 'Male' }, { value: 2, label: 'Female' }, { value: 9, label: 'Not Applicable' }] }
});

Passenger.defaultColumns = 'name, phone, direction';
Passenger.register();