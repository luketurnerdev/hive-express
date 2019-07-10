//Express server setup
const express = require('express');
const app = express();

//Additional packages
const axios = require('axios');
const queryString = require('query-string');

//Passport
const passport = require("./config/passport");
app.use(passport.initialize());

//Meetup authentication
const MeetupAuth = require('./auth/MeetupAuth');

//Temp variables for access tokens
let access_token= "";
let refresh_token= "";

//Root page 
app.get('/', (req,res) => {
    res.send('Testing homepage!');
});

//Direct the user to authenticate on Meetup.com
//This takes them to a callback route below
//TODO - place this into a separate function and separate out variables for client_id and client_secret

app.get('/meetup', (req, res) => {
    res.redirect("https://secure.meetup.com/oauth2/authorize?client_id=n3i689g0cs3tj2qvt7u92q1ul0&response_type=code&redirect_uri=http://localhost:3000/callback");
});

app.get('/callback', MeetupAuth);




//Application-level middleware

app.use((req,res) => {
    console.log('Time: ', Date.now());
    next();
});

//Route specific middleware

app.use("/", (req,res,next) => {
    console.log('This is middleware for a specific route.');
});


module.exports = app;