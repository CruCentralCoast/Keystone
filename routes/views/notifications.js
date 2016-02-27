var keystone = require('keystone');
 
exports = module.exports = function(req, res) {
    
    var view = new keystone.View(req, res);
    var locals = res.locals;
    
    // Load the notifications
    view.query('notifications', keystone.list('Notification').model.find().where('sent', false).sort('time').populate('ministries'));
    view.query('past', keystone.list('Notification').model.find().where('sent', true).sort('-time').populate('ministries'));
    view.query('events', keystone.list('Event').model.find().sort('startDate'));
    view.render('notifications');
}

exports.renderScheduledNotifications = function(req, res) {
    var view = new keystone.View(req, res);
    view.query('notifications', keystone.list('Notification').model.find().where('sent', false).sort('time').populate({
        path: 'ministries',
        populate: {
            path: 'campuses',
            model: 'Campus'
        }
    }));
    view.render('./includes/scheduled-notifications');
}

exports.renderEventNotifications = function(req, res) {
    var view = new keystone.View(req, res);
    view.query('event', keystone.list('Event').model.findOne().where('_id', req.body.event_id).populate('notifications').populate('parentMinistries', 'name'));
    view.render('./includes/event-notifications');
}

exports.renderEventNotificationTable = function(req, res) {
    var view = new keystone.View(req, res);
    view.query('event', keystone.list('Event').model.findOne().where('_id', req.body.event_id).populate('notifications').populate('parentMinistries', 'name'));
    view.render('./includes/event-notification-table');
}
