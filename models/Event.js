var keystone = require('keystone');
var Types = keystone.Field.Types;
var imageUtils = require('./utils/ImageUtils');
var validators = require('mongoose-validators');
var normalizeUrl = require('normalize-url');

/**
 * Event Model
 * ==========
 */

var Event = new keystone.List('Event', {
    map: { name: 'name' },
    autokey: { path: 'slug', from: 'name', unique: true }
});

var s3path = process.env.IMAGE_ROOT_PATH + '/events';

// the separate properties for each imageLink are necessary because in the version of keystone
// these models were created under, the 'format' properties on s3files is broken, so the html is
// not rendered in the admin UI. Eventually this may be fixed.
Event.add({
    name: {
        type: String,
        required: true,
        initial: true,
        validate: [validators.isLength({ message: 'Event Title must be 35 characters or less.' }, 0, 35)]
    },
    description: { type: Types.Textarea, initial: true },
    image: {
        type: Types.S3File,
        required: false,
        allowedTypes: imageUtils.allowedTypes,
        s3path: s3path,
        filename: imageUtils.fileName,
        headers: imageUtils.cacheControl,
        format: imageUtils.formatAdminUIPreview,
        label: "App Image"
    },
    imageLink: {
        type: Types.Url,
        hidden: false,
        noedit: true,
        watch: true,
        value: imageUtils.imageLinkValue,
        format: imageUtils.imageLinkFormat
    },
    squareImage: {
        type: Types.S3File,
        required: false,
        allowedTypes: imageUtils.allowedTypes,
        s3path: s3path,
        filename: imageUtils.squareFileName,
        headers: imageUtils.cacheControl,
        format: imageUtils.formatAdminUIPreview
    },
    squareImageLink: {
        type: Types.Url,
        hidden: false,
        noedit: true,
        watch: true,
        value: imageUtils.squareImageLinkValue,
        format: imageUtils.imageLinkFormat
    },
    bannerImage: {
        type: Types.S3File,
        required: false,
        allowedTypes: imageUtils.allowedTypes,
        s3path: s3path,
        filename: imageUtils.bannerFileName,
        headers: imageUtils.cacheControl,
        format: imageUtils.formatAdminUIPreview
    },
    bannerImageLink: {
        type: Types.Url,
        hidden: false,
        noedit: true,
        watch: true,
        value: imageUtils.bannerImageLinkValue,
        format: imageUtils.imageLinkFormat
    },
    url: {
        type: Types.Url,
        initial: true,
        note: 'A link to the Facebook Event',
        label: "Facebook URL"
    },
    locationTBD: { type: Boolean, initial: true, default: false, label: 'Location TBD' },
    location: { type: Types.Location, initial: true, dependsOn: { locationTBD: false }, defaults: { country: 'USA' } },
    startDate: { type: Types.Datetime, format: 'YYYY MM DD hh:mm a', default: Date.now(), required: true, initial: true },
    endDate: { type: Types.Datetime, format: 'YYYY MM DD hh:mm a', default: Date.now(), required: true, initial: true },
    rideSharing: { type: Types.Boolean, default: false, label: 'Does this event have ride sharing?' },
    ministries: { type: Types.Relationship, ref: 'Ministry', label: 'Which ministries is this event for?', many: true },
    notifications: { type: Types.Relationship, ref: 'Notification', label: 'These are the notifications being sent for this event', many: true },
}, 'Display Options', {
    displayOnWebsite: { type: Types.Boolean, default: false, label: 'Is this event ready to display on the website?' },
    displayOnApp: { type: Types.Boolean, default: false, label: 'Is this event ready to display on the app?' }
});

Event.schema.pre('validate', function(next) {
    this.url = normalizeUrl(this.url, {normalizeHttps: true, stripWWW: false});
    var temp = this.url.split(":");
    this.url = temp[0] + "s:" + temp[1];
    if(!validFacebookEvent(this.url)) {
        var err = new Error('Not a valid Facebook Event URL');
        next(err);
    }
    next();
});

// Verifies that the provided url is formatted as a proper Facebook Event
// Returns True if it is valid
function validFacebookEvent(url) {
    var splitURL = url.split("/events/");
    // Verifies the url is an event url
    if (splitURL.length != 2) {
        return false;
    }
    var website = splitURL[0];
    var eventID = splitURL[1].slice(-1) == "/" ? splitURL[1].slice(0, -1) : splitURL[1];

    // Verifies that the url is for Facebook
    if (website != "https://www.facebook.com") {
        return false;
    }

    // Verifies that the event ID is in the correct form
    if (!isNumeric(eventID)) {
        return false;
    }

    return true;
}

function isNumeric(str) {
    var re = /[0-9]+/;
    var val = str.match(re);

    return val[0].length == str.length;
}

Event.defaultColumns = 'name, location, startDate, endDate, imageLink';
Event.register();
