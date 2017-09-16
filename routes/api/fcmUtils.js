var device = process.env.FCM_DEVICE_TYPE;

module.exports = {
    createMessage: function(title, message) {
        // iOS requires a certain message format
        /*if (device === "iphone") {
            return {
                notification: {
                    body: message,
                    title: title
                }
            };
        } else {
            return {
                data: {
                    message: message,
                    title: title
                }
            };
        }*/
        return {
            notification: {
                body: message,
                title: title,
                sound: "default"
            }
        };
    }
}
