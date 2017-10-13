var keystone = require('keystone');

before(function(done) {
    keystone.init({
        'port': 3002,
        'cookie secret': process.env.COOKIE_SECRET,
        'logger': false
    });
    keystone.import('../models');
    keystone.set('routes', require('../routes'));
    
    keystone.start();
    done();
});

describe('/api', function() {     
    require('./ride.test');
});