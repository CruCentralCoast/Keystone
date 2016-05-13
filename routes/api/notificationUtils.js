var ajax = require("ajax-request");
var gcmAPIKey = process.env.GCM_API_KEY;
var url = "https://gcm-http.googleapis.com/gcm/send"

module.exports.send = function(to, title, message, payload, cb) {
    var headers = {
        Authorization: "key=" + gcmAPIKey,
        "Content-Type": "application/json"
    };
    var notification = {
        title: title,
        body: message,
        sound: 'default'
    };

    var data = {
        to: to,
        content_available: true,
        notification: notification,
        data: payload
    };

    ajax.post({
        url: url,
        headers: headers,
        data: data
    }, cb);
}