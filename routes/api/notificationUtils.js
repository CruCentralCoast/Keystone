var keystone = require('keystone'),
    admin = require("firebase-admin"),
    fcmUtils = require("./fcmUtils");

var private_key = process.env.FCM_ACCOUNT_PRIVATE_KEY;

if (process.env.NODE_ENV == 'production') {
    private_key = JSON.parse(process.env.FCM_ACCOUNT_PRIVATE_KEY);
}

if (process.env.NODE_ENV !== 'staging') {
    admin.initializeApp({
        credential: admin.credential.cert({
            "type": process.env.FCM_ACCOUNT_TYPE,
            "project_id": process.env.FCM_ACCOUNT_PROJECT_ID,
            "private_key_id": process.env.FCM_ACCOUNT_PRIVATE_KEY_ID,
            "private_key": private_key,
            "client_email": process.env.FCM_ACCOUNT_CLIENT_EMAIL,
            "client_id": process.env.FCM_ACCOUNT_CLIENT_ID,
            "auth_uri": process.env.FCM_ACCOUNT_AUTH_URI,
            "token_uri": process.env.FCM_ACCOUNT_TOKEN_URI,
            "auth_provider_x509_cert_url": process.env.FCM_ACCOUNT_AUTH_PROVIDER_X509_CERT_URL,
            "client_x509_cert_url": process.env.FCM_ACCOUNT_CLIENT_X509_CERT_URL
        }),
        databaseURL: "https://cru-central-coast-ios.firebaseio.com"
    });
}

module.exports.sendToDevice = function (tokens, title, body, subTitle, callback) {
    if (!Array.isArray(tokens)) return new Error("sendToDevice expects an Array of FCM Tokens as its first parameter");

    var options = {
        contentAvailable: true,
        priority: "high"
    };

    tokens.forEach(function(token) {
        if (token.id) {
            var payload = fcmUtils.createMessage(title, body, token.device);
            
            admin.messaging().sendToDevice(token.id, payload, options).then(function (response) {
                console.log("Successfully sent message:", response);
                addToUserNotifications(title, body, subTitle, true, token.leader);
                callback();
            }).catch(function (error) {
                console.log("Error sending message:", error);
                addToUserNotifications(title, body, subTitle, false, token.leader);
                callback();
            });
        } else {
            addToUserNotifications(title, body, subTitle, false, token.leader);
        }
    }, this);
};

function addToUserNotifications(title, body, subTitle, sent, user) {
    keystone.createItems({
        UserNotification: [{
            title: title,
            body: body,
            subTitle: subTitle,
            sent: sent,
            user: user
        }]
    });
}

module.exports.sendToTopic = function (topics, payload, callback) {
    admin.messaging().sendToTopic(topics, payload).then(function (response) {
        console.log("Successfully sent message:", response);
        callback();
    }).catch(function (error) {
        console.log("Error sending message:", error);
        callback();
    });
};
