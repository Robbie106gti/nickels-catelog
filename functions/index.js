'use strict';

const functions = require('firebase-functions');

// CORS Express middleware to enable CORS Requests.
const cors = require('cors')({
  origin: true
});

// Firebase Setup
const admin = require('firebase-admin');
const serviceAccount = require('./service-account.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: `https://nickels-catalog.firebaseio.com`
});

// We use Request to make the basic authentication request in our example.
const basicAuthRequest = require('request');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((req, res) => {
//   res.send("Hello from Firebase!");
//  });


 // exports.loginInfo = functions.https.onRequest((req, res) => {
 //   req.on(() => request.post({url:'http://www.testquoin.com/API/Authenticate', form: {Username:'Robert', Pwd:'rob2nickels'}}, function(err,httpResponse,body) { 
 //      if (!err && httpResponse.statusCode == 200)
 //     httpResponse.send(body, httpResponse); 
 //  }))
 // });
 
 exports.auth = functions.https.onRequest((req, res) => {
  const handleError = (username, error) => {
    console.error({
      User: username
    }, error);
    return res.sendStatus(500);
  };

  const handleResponse = (username, status, body) => {
    console.log({
      User: username
    }, {
      Response: {
        Status: status,
        Body: body
      }
    });
    if (body) {
      return res.status(200).json(body);
    }
    return res.sendStatus(status);
  };

  let username = '';
  try {
    cors(req, res, () => {
      // Authentication requests are POSTed, other requests are forbidden
      if (req.method !== 'POST') {
        return handleResponse(username, 403);
      }
      username = req.body.username;
      if (!username) {
        return handleResponse(username, 400);
      }
      const password = req.body.password;
      if (!password) {
        return handleResponse(username, 400);
      }

      // TODO(DEVELOPER): In production you'll need to update the `authenticate` function so that it authenticates with your own credentials system.
      authenticate(username, password).then(valid => {
        if (!valid) {
          return handleResponse(username, 401); // Invalid username/password
        }

        // On success return the Firebase Custom Auth Token.
        return admin.auth().createCustomToken(username).then(firebaseToken => {
          return handleResponse(username, 200, {
            token: firebaseToken
          });
        });
      }).catch(error => {
        return handleError(username, error);
      });
    });
  } catch (error) {
    return handleError(username, error);
  }
});

/**
 * Authenticate the provided credentials.
 * TODO(DEVELOPER): In production you'll need to update this function so that it authenticates with your own credentials system.
 * @returns {Promise<boolean>} success or failure.
 */
function authenticate(username, password) {

  // For the purpose of this example use httpbin (https://httpbin.org) and send a basic authentication request.
  // (Only a password of `Testing123` will succeed)
  // const authEndpoint = `https://httpbin.org/basic-auth/${username}/Testing123`;
  const authEndpoint = `http://www.testquoin.com/API/Authenticate?Username=${username}&Pwd=${password}`;
  // const creds = {
  //   auth: {
  //     user: username,
  //     pass: password
  //   }
  // };
  const creds = {
    auth: {
      username: username,
      pwd: password
    }
  };
  return new Promise((resolve, reject) => {
    basicAuthRequest(authEndpoint, creds, (error, response, body) => {
      if (error) {
        return reject(error);
      }
      const statusCode = response ? response.statusCode : 0;
      if (statusCode === 401) { // Invalid username/password
        return resolve(false);
      }
      if (statusCode !== 200) {
        return reject(Error('invalid response returned from ', authEndpoint, ' status code ', statusCode));
      }
      console.log(body)
      return resolve(true);
    });
  });
}
