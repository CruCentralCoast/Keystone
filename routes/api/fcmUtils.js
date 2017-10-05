module.exports = {
    // Device Types: 'iPhone', 'Android', 'Topic'
    createMessage: function (title, message, device) {
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
};
