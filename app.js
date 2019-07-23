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
app.use(cors(
    {
        origin: process.env.REACT_SERVER,
        credentials: true
    }
));

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

module.exports = app;
