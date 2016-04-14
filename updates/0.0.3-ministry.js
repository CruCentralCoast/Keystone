var keystone = require('keystone'),
    Ministry = keystone.list("Ministry").model;

function update_ministries() {    
    Ministry.find().exec(function(err, ministries) {
        ministries.forEach(function(ministry) {
            console.log(ministry.campuses);
            ministry.campus = ministry.campuses[0];
            ministry.campuses = [];
            ministry.save();
        });
    });
}

exports = module.exports = function(done) { 
    update_ministries();
}