var keystone = require('keystone'),
    Ministry = keystone.list("Ministry").model;

function update_ministries() {    
    Ministry.find().exec(function(err, ministries) {
        ministries.forEach(function(ministry) {
            var campuses = JSON.parse(JSON.stringify(ministry)).campuses;
            if (campuses != null)
            {
                ministry.campus = campuses[0];
                ministry.campuses = [];
                ministry.save();
            }
        });
    });
}

exports = module.exports = function(done) { 
    update_ministries();
    done();
}