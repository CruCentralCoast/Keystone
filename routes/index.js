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

var _ = require('underscore');
var keystone = require('keystone');
var middleware = require('./middleware');
var importRoutes = keystone.importer(__dirname);

//var users = require('./api/user');

// Common Middleware
keystone.pre('routes', middleware.initLocals);
keystone.pre('render', middleware.flashMessages);

// Import Route Controllers
var routes = {
	views: importRoutes('./views'),
	api: importRoutes('./api')
};

function addApiRoutes(app, name, route) {
	app.get('/api/' + name + '/list', keystone.middleware.api, route.list);
	app.get('/api/' + name + '/:id', keystone.middleware.api, route.get);
	app.all('/api/' + name + '/find', keystone.middleware.api, route.find);
	app.all('/api/' + name + '/search', keystone.middleware.api, route.search);
	app.all('/api/' + name + '/create', keystone.middleware.api, route.create); //TODO: take this out	
    app.all('/api/' + name + '/update', keystone.middleware.api, route.update);
    if (route.enumValues)
        app.get('/api/' + name + '/enumValues/:key', keystone.middleware.api, route.enumValues);
}

// Setup Route Bindings
exports = module.exports = function(app) {
	
	// Views
	app.get('/', routes.views.index);
	// app.get('/blog/:category?', routes.views.blog);
	// app.get('/blog/post/:post', routes.views.post);
	// app.get('/gallery', routes.views.gallery);
	// app.all('/contact', routes.views.contact);
    app.get('/notifications', middleware.requireUser, routes.views.notifications);
    app.get('/notifications/renderScheduledNotifications', routes.views.notifications.renderScheduledNotifications);
    app.all('/notifications/renderEventNotifications', routes.views.notifications.renderEventNotifications);
    app.all('/notifications/renderEventNotificationTable', routes.views.notifications.renderEventNotificationTable);
	// NOTE: To protect a route so that only admins can see it, use the requireUser middleware:
	// app.get('/protected', middleware.requireUser, routes.views.protected);
	
	// API stuff
	app.post('/api/signin', routes.api.authUtils.signin);
	app.post('/api/signout', routes.api.authUtils.signout);

	addApiRoutes(app, 'summermission', routes.api.summermission);	
	addApiRoutes(app, 'ministry', routes.api.ministry);	
	addApiRoutes(app, 'ministryteam', routes.api.ministryteam);	
	addApiRoutes(app, 'campus', routes.api.campus);	
	addApiRoutes(app, 'event', routes.api.event);	
	addApiRoutes(app, 'user', routes.api.user);	
    //app.all('/api/user/enumValues', keystone.middleware.api, routes.api.user.enumValues);
    addApiRoutes(app, 'communitygroup', routes.api.communitygroup);
    addApiRoutes(app, 'ride', routes.api.ride);		
    app.all('/api/ride/addPassenger', keystone.middleware.api, routes.api.ride.addPassenger);
    app.all('/api/ride/dropPassenger', keystone.middleware.api, routes.api.ride.dropPassenger);
    app.all('/api/ride/dropRide', keystone.middleware.api, routes.api.ride.dropRide);
    //app.all('/api/ride/search', keystone.middleware.api, routes.api.ride.search);
    addApiRoutes(app, 'passenger', routes.api.passenger);	
    addApiRoutes(app, 'notification', routes.api.notification);	
    addApiRoutes(app, 'resource', routes.api.resource);
    addApiRoutes(app, 'resourcetag', routes.api.resourcetag);
    app.all('/api/notification/push', keystone.middleware.api, routes.api.notification.push);
    app.all('/api/notification/addEventNotification', keystone.middleware.api, routes.api.notification.addEventNotification);
    //console.log(users);
    //app.use('/api/user', users);
};
