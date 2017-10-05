var keystone = require('keystone'),
    express = require('express'),
    router = express.Router();

router.route('/')
    .get(function (req, res) {
        var view = new keystone.View(req, res);
        view.render('coverage');
    });

module.exports = router;
