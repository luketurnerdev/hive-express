const User = require("../database/models/user_model");

/*  
 *  Find a user in the database using the access_token stored in cookies.
 *  If unsuccessful, call error handler middleware.
 */
async function findUserByToken(req, next){
  try {
    // check tokens cookie
    // if (!req.cookies.tokens) throw new HTTPError(404, "Missing 'tokens' cookie.");
    // get access token from cookies
    // let accessToken = req.cookies.tokens.access_token;
    
    let accessToken = "5cab9b3b26fb5a530183089b092080db";
    

    // check the token
    if (!accessToken) throw new HTTPError(404, "Missing user's access_token.");

    // find user with access token
    return await User
      .findOne({ access_token: accessToken })
      .then(resp => {
        // check the response
        if (!resp) throw new HTTPError(404, "User not found.");
        else return resp;
      })
    } catch(err) {
      // If errors, return with error middleware
      return next(err);
  };
}

module.exports = findUserByToken;