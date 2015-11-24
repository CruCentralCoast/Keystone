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
	app.all('/api/' + name + '/create', keystone.middleware.api, route.create); //TODO: take this out	
}

// Setup Route Bindings
exports = module.exports = function(app) {
	
	// Views
	app.get('/', routes.views.index);
	app.get('/blog/:category?', routes.views.blog);
	app.get('/blog/post/:post', routes.views.post);
	app.get('/gallery', routes.views.gallery);
	app.all('/contact', routes.views.contact);
	
	// NOTE: To protect a route so that only admins can see it, use the requireUser middleware:
	// app.get('/protected', middleware.requireUser, routes.views.protected);
	
	// API stuff
	addApiRoutes(app, 'summermission', routes.api.summermission);	
	addApiRoutes(app, 'ministry', routes.api.ministry);	
	addApiRoutes(app, 'ministryteam', routes.api.ministryteam);	
	addApiRoutes(app, 'campus', routes.api.campus);	
	addApiRoutes(app, 'post', routes.api.post);	
	addApiRoutes(app, 'postcategory', routes.api.postcategory);	
	addApiRoutes(app, 'event', routes.api.event);	
	addApiRoutes(app, 'gallery', routes.api.gallery);	
	addApiRoutes(app, 'user', routes.api.user);	
};
