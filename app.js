//localStorage
// import behavioursubject from 'rxjs'
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
app.use(cors());



// Handlebars view engine
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Cookie Parser
app.use(cookieParser());

// Body parser, get streams as json
//app.use(express.urlencoded({ extended: false }));
//app.use(express.json());

// Method Override
app.use(methodOverride("_method"));

// Morgan
app.use(morgan("tiny"));

//Body-parser for converting to JSON
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes from /routes
app.use(require("./routes"));

//Route specific middleware
// app.use("/", (req, res, next) => {
//   console.log("This is middleware for a specific route.");
// });

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

module.exports = app;
