//localStorage
// import behavioursubject from 'rxjs'
//Express server setup
const express = require('express');
const app = express();
require("dotenv").config();

//Additional packages
const axios = require('axios');
const queryString = require('query-string');

//Passport
const passport = require("./config/passport");
app.use(passport.initialize());

//Meetup authentication
const MeetupAuth = require('./auth/MeetupAuth').MeetupAuth;
const MeetupService = require("./services/MeetupService");


//Root page 
app.get('/', (req,res) => {
    res.send('Testing homepage!');
});


//Direct the user to authenticate on Meetup.com
//This takes them to a callback route below
//TODO - place this into a separate function and separate out variables for client_id and client_secret

app.get('/meetup', (req, res) => 
{
    // process.env.PORT
    //Add the 'scope' parameter in the headers to ask for more permissions, e.g., RSVP access etc.
    //Basic and RSVP
    res.redirect("https://secure.meetup.com/oauth2/authorize?client_id=n3i689g0cs3tj2qvt7u92q1ul0&response_type=code&redirect_uri=http://localhost:3000/callback");
});

//Return from meetup auth page and fetch access and refresh tokens
app.get('/callback', MeetupAuth);



//Application-level middleware goes here



//Route specific middleware goes here



module.exports = app;