var gcm = require('node-gcm')

var device = process.env.GCM_DEVICE_TYPE;

module.exports = {
    createMessage: function(title, message) {
        // iOS requires a certain message format
        if (device === "iphone") {
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
