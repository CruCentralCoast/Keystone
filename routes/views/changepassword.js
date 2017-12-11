var keystone = require('keystone');

// Page endpoint. Renders the page
exports = module.exports = function (req, res) {

    var view = new keystone.View(req, res);

    // Load the Change Password View
    view.render('changepassword');
};