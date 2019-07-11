//localStorage
// import behavioursubject from 'rxjs'
//Express server setup
const express = require('express');
const app = express();

//API Keys
require("dotenv").config();
client_id = process.env.CLIENT_ID;
client_secret = process.env.CLIENT_SECRET;
redirect_uri = process.env.REDIRECT_URI;
//Additional packages
const axios = require('axios');
const queryString = require('query-string');

//Passport
// const passport = require("./config/passport");
// app.use(passport.initialize());

//Meetup authentication
const MeetupAuth = require('./auth/MeetupAuth').MeetupAuth;
const MeetupService = require("./services/MeetupService");



//Root page 
app.get('/', (req,res) => {
    let access_token, refresh_token;
    //Has there been a token defined? If so, assign a variable

    if (MeetupService.getItem('current-user')){
        access_token = MeetupService.getItem('current-user').access_token;
        refresh_token = MeetupService.getItem('current-user').refresh_token;
    }
    res.send(`Testing. Access token: ${access_token}, refresh: ${refresh_token}`);
    console.log(MeetupService);

});


//Direct the user to authenticate on Meetup.com
//This takes them to a callback route below
//TODO - place this into a separate function and separate out variables for client_id and client_secret

app.get('/meetup', (req, res) => 
{
    //TODO: Add the 'scope' parameter in the headers to ask for more permissions, e.g., RSVP access etc.
    //Basic and RSVP
    res.redirect
        (`https://secure.meetup.com/oauth2/authorize?client_id=${client_id}&response_type=code&redirect_uri=${redirect_uri}`);
});

//Return from meetup auth page and fetch access and refresh tokens
app.get('/callback', MeetupAuth);



//Application-level middleware goes here



//Route specific middleware goes here



module.exports = app;