var keystone = require('keystone');
var Types = keystone.Field.Types;
var validators = require('mongoose-validators');

/**
 * Ride Model
 * ==========
 */

var Ride = new keystone.List('Ride', {
});

Ride.add({
    event: { type: Types.Relationship, ref: 'Event', initial: true, required: true},
    driverName: {type: String, required: true, initial: true},
    driverNumber: { type: String, required: true, initial: true},
    fcmId: { type: String, required: true, initial: true},
    deviceType: { type: Types.Select, options: [{ value: 1, label: 'iPhone' }, { value: 2, label: 'Android' }]},
    passengers: { type: Types.Relationship, ref: 'Passenger', many: true},
    location: { type: Types.Location, defaults: { country: 'USA' } },
    time: { type: Types.Datetime, parseFormat: 'MMM DD YYYY hh:mm a' , format: 'YYYY-MM-DD h:m a', default: Date.now()},
    radius: { type: Types.Number, min: 0, max: 100 },
    seats: { type: Types.Number , validate: validators.isInt(), min : 1, max: 20},
    direction: { type: Types.Select, options: 'to, from, both' },
    gender: { type: Types.Select, numeric: true, emptyOption: false, options: [{ value: 0, label: 'Unknown' }, { value: 1, label: 'Male' }, { value: 2, label: 'Female' }, { value: 9, label: 'Not Applicable' }] },
});

Ride.defaultColumns = 'location, radius, time, seats';
Ride.register();
