require('dotenv').load();

var keystone = require('keystone');

before(function(done) {
    keystone.init({
        'port': 3002,
        'mongo': 'mongodb://localhost/testdb',
        'cloudinary config': 'cloudinary://955548139627676:PijJ5AQV4TMpGb8YzDWhG307FjU@debabl6od',
        'cookie secret': "/C=4'sR,632Px&57Z^H4snZD1Cy4|6",
        'logger': false
    });
    keystone.import('../models');
    keystone.set('routes', require('../routes'));
    
    keystone.set('locals', {
      _: require('underscore'),
      env: keystone.get('env'),
      utils: keystone.utils,
      editable: keystone.content.editable
    });
    
    keystone.start();
    done();
})

describe('/api', function() {     
    require('./ride.test');
});