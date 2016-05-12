var keystone = require('keystone'),
    express = require('express'),
    router = express.Router(),
    root = require('app-root-path');
    
router.route('/')
    .get(function(req, res, next) {
        var view = new keystone.View(req, res);       
        view.render('coverage');
    });
    
module.exports = router;