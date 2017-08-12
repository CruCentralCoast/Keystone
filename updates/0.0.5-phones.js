var keystone = require('keystone'),
    User = keystone.list("User").model;

function update_phones(cb) {
    User.find().exec(function(err, users) {
        users.forEach(function(user) {
            var phone = String(user.phone);
            user.phone = "1231231234";

            user.save(function(err, user) {
                if (err) {
                    console.log(err);
                    cb(false);
                }
                user.phone = phone;
                user.save(function(err, user) {
                    if (err) {
                        console.log(err);
                        cb(false);
                    }
                });
            });
        });
        cb(true);
    });
}

exports = module.exports = function(done) {
    update_phones(function(success) {
        if (success) done();
    });
}
