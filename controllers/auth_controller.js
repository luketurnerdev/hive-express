//API Keys
const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;
const redirect_uri = process.env.REDIRECT_URI;

//User Model for creation and updating of users
const User = require("./../database/models/user_model");
const usersController = require("./users_controller");

//Packages / Imports
const axios = require("axios");
const queryString = require("query-string");
const meetupService = require("../services/meetupService");

/*
    Authenticate the user on Meetup.com and return an access token and refresh token.
    These tokens are stored in the database and are updated upon re-authorization
*/

function meetupRedirect(req, res) {
  //Scopes are passed through in the redirect URL, separated by spaces
  //We are using ageless (for longer tokens) and RSVP (for enabling users to RSVP via hive)
  const scopes = "ageless rsvp";

  res.redirect(
    `https://secure.meetup.com/oauth2/authorize?client_id=${client_id}&scope=${scopes}&response_type=code&redirect_uri=${redirect_uri}`
  );

  //Note - getting output that the RSVP is working is difficult (confirmed ageless works)
  // However, Hamish and I have tested it and it should be working based several console.log debugs
}

async function meetupAuth(req, res) {
  console.log("This is the meetup authorization js file.");

  //Use external service file to retrieve auth info via axios

  const tokens = await meetupService.getTokens(req.query.code);
  const userData = await meetupService.getUserInfo(tokens.access_token);

  //Take the params that meetup allows us to take and store this in an object
  let userProfileInfo = {
    meetup_uid: userData.id,
    email: userData.email,
    name: userData.name,
    city: userData.city,
    admin: false,
    confirmed: false,
    access_token: tokens.access_token,
    refresh_token: tokens.refresh_token
  };
  userProfileInfo["photo"] = userData.photo ? userData.photo.photo_link : "";

  //Does the user exist?
  const user = await User.findOne({ meetup_uid: userProfileInfo.meetup_uid });

  //If user doesn't exist, create them
  if (!user) {
    //Create new user
    const config = {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    };

    //Put the body data in the correct format
    const body = queryString.stringify(userProfileInfo);

    axios
      .post(`${process.env.ROOT_SERVER}/auth/register`, body, config)
      .then(function(response) {
        console.log(`Sucessfully created user ${userData.name}!`);
      })
      .catch(function(error) {
        console.log(error);
      });
  } else {
    //Update the user's tokens and updated_at fields

    //Call the controller method with the id of the user,
    // and the new values to apply

    const newValues = {
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      created_at: Date.now(),
      updated_at: Date.now()
    };

    console.log(
      `Updating the user's access token to ${
        newValues.access_token
      } and refresh token to ${newValues.refresh_token}`
    );

    usersController.updateTokens(userData.id, newValues);
  }

  res.cookie("tokens", {
    access_token: tokens.access_token,
    refresh_token: tokens.refresh_token
  });

  //Return to homepage (TODO: add confirmation that they have logged in (front end))
  //Will also need to send them to a 'request pending' splash page if their account is not approved by staff
  res.redirect("/");
}

module.exports = {
  meetupRedirect,
  meetupAuth
};
