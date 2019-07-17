const User = require("./../database/models/user_model");
const axios = require("axios");

// GET to "/"
// Show homepage
function homepage(req, res) {
  console.log("COOKIES:", req.cookies);
  res.render("pages/homepage");
}


// GET to "/register"
// Login/Register the meetup.com user
function register(req, res) {
  res.render("pages/register");
}

// GET to "/accountrequests"
// Displays the users account approval status,
// or a list of pending approvals for admins

function accountrequests(req, res) {
  res.render("pages/accountrequests")
}

// Show dashboard with user's events and list upcoming meetups
async function dashboard(req, res) {
  // Find current user
  let accessToken = req.cookies.tokens.access_token;
  let user = await User.findOne({access_token: accessToken});


  // if "tokens" cookie isn't found
  if (!req.cookies.tokens) {
    // redirect to homepage
    return res.redirect("/")
  }

  //Redirect user if their account is unconfirmed
  if (!user.confirmed) {
    return res.redirect("/accountrequests")
  }

  

  // Find upcoming meetups
  let upcomingMeetups = await axios
    .get(
      `https://api.meetup.com/find/upcoming_events?&sign=true&photo-host=public&topic_category=programming&page=20`,
      {
        headers: {
          "Authorization": `Bearer ${accessToken}`
        }
      }
    )
    .then(resp => resp.data.events)
    .catch(err => console.error(err));

  // Render the dashboard view and pass objects with data to display.
  res.render("pages/dashboard", { upcomingMeetups, user });
}

async function profile(req, res) {

  // if "tokens" cookie isn't found
  if (!req.cookies.tokens) {
    // redirect to homepage
    return res.redirect("/")
  }

  // Find current user
  let accessToken = req.cookies.tokens.access_token;
  let user = await User.findOne({access_token: accessToken});
  console.log('user info' + user);

  // Find upcoming meetups
  let upcomingMeetups = await axios
    .get(
      `https://api.meetup.com/find/upcoming_events?&sign=true&photo-host=public&topic_category=programming&page=20`,
      {
        headers: {
          "Authorization": `Bearer ${accessToken}`
        }
      }
    )
    .then(resp => resp.data.events)
    .catch(err => console.error(err));

  // Render the dashboard view and pass objects with data to display.
  res.render("pages/dashboard", { upcomingMeetups, user });
}

module.exports = {
   homepage,
   register,
   dashboard,
   accountrequests
};
