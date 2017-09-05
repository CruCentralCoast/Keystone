var admin = require("firebase-admin");

admin.initializeApp({
  credential: admin.credential.cert("cru-central-coast-ios-firebase-adminsdk-gzir9-1165827504.json"),
  databaseURL: "https://cru-central-coast-ios.firebaseio.com"
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
