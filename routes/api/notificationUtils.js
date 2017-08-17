var admin = require("firebase-admin");

admin.initializeApp({
  credential: admin.credential.cert("cryptic-cache-161922-firebase-adminsdk-y59aa-17be847940.json"),
  databaseURL: "https://cryptic-cache-161922.firebaseio.com"
});

module.exports.sendToDevice = function(tokens, payload, callback) {
    payload.content_available = true;
    payload.priority = 'high';
    payload.data.sound = 'default';

    admin.messaging().sendToDevice(tokens, payload).then(function(response) {
        console.log("Successfully sent message:", response);
        callback();
    })
    .catch(function(error) {
        console.log("Error sending message:", error);
        callback();
    });
}

module.exports.sendToTopic = function(topics, payload, callback) {
    admin.messaging().sendToTopic(topics, payload).then(function(response) {
        console.log("Successfully sent message:", response);
        callback();
    })
    .catch(function(error) {
        console.log("Error sending message:", error);
        callback();
    });
}
