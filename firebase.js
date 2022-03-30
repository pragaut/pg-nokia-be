var admin = require("firebase-admin"); 
var serviceAccount = require("./bin/nokia-firebase-sdk.json"); 
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const registerToken = async (token, topic) => {
  try {
    if (token) {
      admin.messaging().subscribeToTopic(token, topic)
        .then((response) => {
          // See the MessagingTopicManagementResponse reference documentation
          // for the contents of response.
          console.log('Successfully subscribed to topic: ------- ', response);
          return 'success'
        })
        .catch((error) => {
          console.log('Error subscribing to topic:', error);
          return error
        });
    }
    else {
      return 'error'
    }
  }
  catch (error) {
    return error
  }
};

const sendMessageToTopic = async (topic, title, body) => {
  try {
    if (topic) { 
      const payload = {
        notification: {
          title: title,
          body: body
        }
      };

      admin.messaging().sendToTopic(topic, payload)
        .then((response) => {
          console.log('Successfully send message to topic:', response);
          return 'success'
        })
        .catch((error) => {
          console.log('error  send message to topic 1:', error);
          return error
        });
    }
    else {
      console.log('error  send message to topic 2:');
      return 'topic not fount'
    }
  }
  catch (error) {
    console.log('error  send message to topic 3:', error);
    return error
  }
};

const sendMessageToDevice = async (tokens, title, body) => {
  try {
    console.log('-------sendMessageToDevice-----------------',tokens);
    console.log('-----------sendMessageToDevice------------:', body);
    if (tokens) { 
      const payload = {
        notification: {
          title: title,
          body: body
        }
      }; 
      admin.messaging().sendToDevice(tokens,payload)
        .then((response) => {
          console.log('Successfully send message to topic:', response);
          return 'success'
        })
        .catch((error) => {
          console.log('error  send message to topic 1:', error);
          return error
        });
    }
    else {
      console.log('error  send message to topic 2:');
      return 'topic not fount'
    }
  }
  catch (error) {
    console.log('error  send message to topic 3:', error);
    return error
  }
};
const sendMessageToTopicFromAPI = async (title, body, _topic) => {
  try {
    if (title && body) {

      const payload = {
        notification: {
          title: title,
          body: body
        }
      };

      const topic = _topic; 

      admin.messaging().sendToTopic(topic, payload)
        .then((response) => {
          console.log('Successfully subscribed to topic:', response);
        })
        .catch((error) => {
          console.log('Error subscribing to topic:', error);
        });
    }
    else {

    }
  }
  catch (error) {

  }
};

module.exports.registerToken = registerToken;
module.exports.sendMessageToTopic = sendMessageToTopic;
module.exports.sendMessageToTopicFromAPI = sendMessageToTopicFromAPI;
module.exports.sendMessageToDevice = sendMessageToDevice;