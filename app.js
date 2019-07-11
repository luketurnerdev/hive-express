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
