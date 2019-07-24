//Express server setup
const express = require("express");
const exphbs = require("express-handlebars");
const morgan = require("morgan");
const methodOverride = require("method-override");
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');

//Enable cors
app.use(cors({
    origin: process.env.REACT_SERVER,
    credentials: true
 }));

// Handlebars view engine
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Cookie Parser
app.use(cookieParser());

// Method Override
app.use(methodOverride("_method"));

// Morgan
app.use(morgan("tiny"));

//Body-parser for converting to JSON
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes from /routes
app.use(require("./routes"));

// Error Handler Middleware
app.use(require("./middleware/error_handler_middleware"));

//Enable use of process.env calls
require("dotenv").config();
<<<<<<< HEAD
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
const meetupService = require("./services/MeetupService");

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
=======
>>>>>>> 29fd11c8818f45fb3a67cc7729afbffa24bd0f62

module.exports = app;
