var gcm = require('node-gcm'),
    propertyReader = require('properties-reader'),
    root = require("app-root-path");

var properties = propertyReader(root + '/properties.ini');
var device = properties.path().gcm.device.type;

module.exports = {
    createMessage: function(title, message) {
        // iOS requires a certain message format
        if (device == "iphone") {
            return new gcm.Message({
                notification: {
                    body: message, 
                    title: title
                }
            });
        } else {
            return new gcm.Message({
                data: {
                    message: message,
                    title: title
                }
            });
        }
    }
}
