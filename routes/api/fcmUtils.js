module.exports = {
    // Device Types: 'iPhone', 'Android', 'Topic'
    createMessage: function (title, body, device) {
        // iOS requires a certain message format
        if (device === "iphone") {
            return {
                notification: {
                    body: body,
                    title: title,
                    sound: "default"
                }
            };
        } else {
            return {
                data: {
                    message: body,
                    title: title,
                    sound: "default"
                }
            };
        }
    }
};
