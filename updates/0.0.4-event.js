var keystone = require('keystone'),
    Event = keystone.list("Event").model;

function update_events() {    
    Event.find().exec(function(err, events) {
        events.forEach(function(event) {
            var ministries = JSON.parse(JSON.stringify(event)).parentMinistries;
            if (ministries != null)
            {
                event.ministries = ministries;
                event.parentMinistries = [];
                event.save();
            }
        });
    });
}

exports = module.exports = function(done) { 
    update_events();
    done();
}