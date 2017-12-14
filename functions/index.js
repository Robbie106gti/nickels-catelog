const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);
const express = require('express');
const cookieParser = require('cookie-parser')();
const cors = require('cors')({origin: true});
const app = express();
const request = require('request');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.helloWorld = functions.https.onRequest((request, response) => {
  response.send("Hello from Firebase!");
 });

exports.loginInfo = request.post({url:'http://www.testquoin.com/API/Authenticate', form: {Username:'Robert', Pwd:'rob2nickels'}}, function(err,httpResponse,body) { 
  // if (!err && httpResponse.statusCode == 200)
   httpResponse.send(body, httpResponse); 
}  
 });
