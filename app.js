//Express server setup
const express = require("express");
const port = 3000;
const app = express();
const morgan = require("morgan");

//Root page
app.get("/", (req, res) => {
  res.send("Testing!");
});

//Application-level middleware
app.use((req, res, next) => {
  console.log("Time: ", Date.now());
  next();
});
// Morgan
app.use(morgan("combined"));

//Route specific middleware
app.use("/", (req, res, next) => {
  console.log("This is middleware for a specific route.");
});

//Port listening
app.listen(port, () => console.log(`Express running on port ${port}`));

module.exports = app;
