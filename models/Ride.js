var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Ride Model
 * ==========
 */

var Ride = new keystone.List('Ride', {
});

Ride.add({
    event: { type: Types.Relationship, ref: 'Event'},
    driverName: {type: String, required: true, initial: true},
    driverNumber: { type: String, required: true, initial: true},
    gcmAPIKey: { type: String, required: true, initial: true},
    passengers: { type: Types.Relationship, ref: 'Passenger', many: true},
    location: { type: Types.Location, defaults: { country: 'USA' } },
    time: { type: Types.Datetime, format: 'MMM Do YYYY hh:mm a', default: Date.now()},
    radius: { type: Types.Number }, 
    seats: { type: Types.Number },
    direction: { type: Types.Select, options: 'to, from, both' },
    gender: { type: String }
});

Ride.defaultColumns = 'location, radius, time, seats';
Ride.register();
