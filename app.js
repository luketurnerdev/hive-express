//Express server setup
const express = require("express");
const morgan = require("morgan");
const methodOverride = require("method-override");
const app = express();

//Root page
app.get("/", (req, res) => {
  res.send("Testing!");
});

//Application-level middleware
app.use((req, res, next) => {
  console.log("Time: ", Date.now());
  next();
});

// Body parser, get streams as json
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Method Override
app.use(methodOverride("_method"));

// Morgan
app.use(morgan("combined"));

//Route specific middleware
app.use("/", (req, res, next) => {
  console.log("This is middleware for a specific route.");
});

module.exports = app;
