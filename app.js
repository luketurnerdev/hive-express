//localStorage
// import behavioursubject from 'rxjs'
//Express server setup
const express = require("express");
const exphbs = require("express-handlebars");
const morgan = require("morgan");
const methodOverride = require("method-override");
const app = express();

// Handlebars view engine
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Body parser, get streams as json
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Method Override
app.use(methodOverride("_method"));

// Morgan
app.use(morgan("combined"));

// Routes from /routes
app.use(require("./routes"));

//Route specific middleware
app.use("/", (req, res, next) => {
  console.log("This is middleware for a specific route.");
});

module.exports = app;


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
const meetupAuth = require('./controllers/auth_controller').meetupAuth;
// const tester = require('./controllers/auth_controller').tester;
const meetupService = require("./services/meetupService");



//Root page 
app.get('/', (req,res) => {
    let access_token, refresh_token;
    //Has there been a token defined? If so, assign a variable

    if (meetupService.getItem('current-user')){
        access_token = meetupService.getItem('current-user').access_token;
        refresh_token = meetupService.getItem('current-user').refresh_token;
    }
    res.send(`Testing. Access token: ${access_token}, refresh: ${refresh_token}`);
    console.log(meetupService);

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
app.get('/callback', meetupAuth);



//Application-level middleware goes here



//Route specific middleware goes here



module.exports = app;
