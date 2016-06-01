var ajax = require("ajax-request");
var gcmAPIKey = process.env.GCM_API_KEY;
var url = "https://gcm-http.googleapis.com/gcm/send"

module.exports.send = function(to, title, message, payload, cb) {
    var headers = {
        Authorization: "key=" + gcmAPIKey,
        "Content-Type": "application/json"
    };

    var data = {
        to: to,
        content_available: true,
        data: {
            title: title,
            body: message,
            sound: 'default',
            payload: payload
        }
    };

    ajax.post({
        url: url,
        headers: headers,
        data: data
    }, cb);
}