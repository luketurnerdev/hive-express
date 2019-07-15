const Event = require("./../database/models/event_model");
const axios = require("axios");
//const User = require("./../database/models/user_model");

// GET to "/"
function homepage(req, res) {
  console.log(req.cookies);
  res.render("pages/homepage");
}
// GET to "/register"

function register(req, res) {
  res.render("pages/register");
}

async function dashboard(req, res) {

  /* Psuedocode 

  // let accessToken = User.find({id: current_users_id}).access_token;

  */

  let upcomingMeetups = await axios
    .get(
      `https://api.meetup.com/find/upcoming_events?&sign=true&photo-host=public&topic_category=programming&page=20`,
      {
        headers: {
          // TODO: Get this dynamically from the current user's database document
          "Authorization": "Bearer 98a5e98c4d17a532c8c6499129b78e9b"
        }
      }
    )
    .then(resp => resp.data.events)
    .catch(err => console.error(err));

  res.render("pages/dashboard", { upcomingMeetups });
}

module.exports = {
   homepage,
   register,
   dashboard
};
