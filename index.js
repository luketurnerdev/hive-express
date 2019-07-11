require("dotenv").config();

require("./database/connect");
const app = require("./app");
const port = process.env.PORT;

// Custom HTTP errors
global.HTTPError = class HTTPError extends Error {
  constructor(statusCode, message) {
    super(message);
    // Preserve StackTrace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, HTTPError);
    }
    this.name = "HTTPError";
    this.statusCode = statusCode;
  }
};

// Start server
app.listen(port, () => console.log(`Server is listening on port ${port}`));

