/**
 * This file is where you define your application routes and controllers.
 *
 * Start by including the middleware you want to run for every request;
 * you can attach middleware to the pre('routes') and pre('render') events.
 *
 * For simplicity, the default setup for route controllers is for each to be
 * in its own file, and we import all the files in the /routes/views directory.
 *
 * Each of these files is a route controller, and is responsible for all the
 * processing that needs to happen for the route (e.g. loading data, handling
 * form submissions, rendering the view template, etc).
 *
 * Bind each route pattern your application should respond to in the function
 * that is exported from this module, following the examples below.
 *
 * See the Express application routing documentation for more information:
 * http://expressjs.com/api.html#app.VERB
 */

var keystone = require('keystone');
var middleware = require('./middleware');
var importRoutes = keystone.importer(__dirname);

// View Controller Routes
var connections = require('./views/connections');
var coverage = require('./views/coverage');

//var users = require('./api/user');
var ministryQuestions = require('./api/ministryquestion');
var ministryTeams = require('./api/ministryteam');
var communityGroups = require('./api/communitygroup');
var questionOptions = require('./api/ministryquestionoption');
var resources = require('./api/resource');
var resourcePages = require('./api/resourcepage');
var resourceTags = require('./api/resourcetag');
var passengers = require('./api/passenger');
var rides = require('./api/ride');
var campuses = require('./api/campus');
var events = require('./api/event');
var users = require('./api/user');
var userNotifications = require('./api/usernotifications');
var ministries = require('./api/ministry');
var summermissions = require('./api/summermission');
var notifications = require('./api/notification');
var fcm = require('./api/fcm');
var prayerRequests = require('./api/prayerrequest');
var prayerResponses = require('./api/prayerresponse');

// Common Middleware
keystone.pre('routes', middleware.initLocals);
keystone.pre('render', middleware.flashMessages);

// Import Route Controllers
var routes = {
    views: importRoutes('./views'),
    api: importRoutes('./api')
};

// Setup Route Bindings
exports = module.exports = function (app) {
    // Views
    app.get('/', routes.views.index);
    app.get('/notifications', middleware.requireUser, routes.views.notifications);
    app.get('/notifications/renderScheduledNotifications', routes.views.notifications.renderScheduledNotifications);
    app.all('/notifications/renderEventNotifications', routes.views.notifications.renderEventNotifications);
    app.all('/notifications/renderEventNotificationTable', routes.views.notifications.renderEventNotificationTable);
    app.get('/changepassword', routes.views.changepassword);
    // NOTE: To protect a route so that only admins can see it, use the requireUser middleware:
    // app.get('/protected', middleware.requireUser, routes.views.protected);

    // API stuff
    app.use('/api/signin', routes.api.authUtils.signin);
    app.use('/api/signout', routes.api.authUtils.signout);

    // Site
    app.use('/connections', connections);
    app.use('/tests/coverage', coverage);

    // API
    app.use('/api/ministryquestions', ministryQuestions);
    app.use('/api/communitygroups', communityGroups);
    app.use('/api/ministryteams', ministryTeams);
    app.use('/api/ministryquestionoptions', questionOptions);
    app.use('/api/resources', resources);
    app.use('/api/resourcetags', resourceTags);
    app.use('/api/resourcepages', resourcePages);
    app.use('/api/passengers', passengers);
    app.use('/api/rides', rides);
    app.use('/api/campuses', campuses);
    app.use('/api/events', events);
    app.use('/api/users', users);
    app.use('/api/usernotifications', userNotifications);
    app.use('/api/ministries', ministries);
    app.use('/api/summermissions', summermissions);
    app.use('/api/notifications', notifications);
    app.use('/api/fcm', fcm);
    app.use('/api/prayerrequest', prayerRequests);
    app.use('/api/prayerresponse', prayerResponses);
};
