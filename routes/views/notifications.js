var keystone = require('keystone');

// Page endpoint. Renders the page
exports = module.exports = function (req, res) {

    var view = new keystone.View(req, res);

    // Load the notifications
    view.query('notifications', keystone.list('Notification').model.find().where('sent', false).sort('time').populate('ministries'));
    view.query('past', keystone.list('Notification').model.find().where('sent', true).sort('-time').populate('ministries'));
    view.query('events', keystone.list('Event').model.find().sort('startDate'));
    view.render('notifications');
};

// Gets the list of scheduled notifications from the server and renders it into a table
exports.renderScheduledNotifications = function (req, res) {
    var view = new keystone.View(req, res);
    view.query('notifications', keystone.list('Notification').model.find().where('sent', false).sort('time').populate({
        path: 'ministries',
        populate: {
            path: 'campuses',
            model: 'Campus'
        }
    }));
    view.render('./includes/scheduled-notifications');
};

// Renders the page that allows a user to create an event push notification
exports.renderEventNotifications = function (req, res) {
    var view = new keystone.View(req, res);
    view.query('event', keystone.list('Event').model.findOne().where('_id', req.body.event_id).populate('notifications').populate('ministries', 'name'));
    view.render('./includes/event-notifications');
};

// Renders the list of event notifications for a given event
exports.renderEventNotificationTable = function (req, res) {
    var view = new keystone.View(req, res);
    view.query('event', keystone.list('Event').model.findOne().where('_id', req.body.event_id).populate('notifications').populate('ministries', 'name'));
    view.render('./includes/event-notification-table');
};
