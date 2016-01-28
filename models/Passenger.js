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
    direction: { type: Types.Select, options: 'to, from, both', required: true, initial: true}
});

Passenger.defaultColumns = 'name, phone, direction';
Passenger.register();