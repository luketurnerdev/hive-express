//localStorage
// import behavioursubject from 'rxjs'
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
const MeetupAuth = require('./auth/MeetupAuth').MeetupAuth;
const MeetupService = require("./services/MeetupService");
const AccessToken = MeetupService.getItem("current-user");
console.log(AccessToken);

//Root page 
app.get('/', (req,res) => {
    res.send('Testing homepage!');
});

//Globals

//Direct the user to authenticate on Meetup.com
//This takes them to a callback route below
//TODO - place this into a separate function and separate out variables for client_id and client_secret

app.get('/meetup', (req, res) => 
{
    //Add the 'scope' parameter in the headers to ask for more permissions, e.g., RSVP access etc.
    //Basic and RSVP
    res.redirect("https://secure.meetup.com/oauth2/authorize?client_id=n3i689g0cs3tj2qvt7u92q1ul0&response_type=code&redirect_uri=http://localhost:3000/callback");
});

//Retrieve access and refresh tokens
app.get('/callback', MeetupAuth);

app.get('/request', () => {
    
})


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