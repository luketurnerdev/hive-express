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

// GET to "/account_requests"
// Displays the users account approval status,
// or a list of pending approvals for admins

async function accountRequests(req, res) {
  //Make a list of unconfirmed accounts
  let unconfirmedAccounts = await User
    .find({
      confirmed:false
    })
    .sort({ created_at: "desc" });

  // Find current user
  let accessToken = req.cookies.tokens.access_token;
  let user = await User.findOne({ access_token: accessToken });

  //TODO: Delete this after we have implemented account approval functionality for Mel
  await User.findByIdAndUpdate(user._id, {
    admin: true
  });

  //Send the user to the dashboard if their account has already been approved

  if (user.confirmed) {
    // return res.redirect("/dashboard")
  }



  //Check if user is admin
  //If yes, render json {unconfirmedAccounts}
  //Otherwise redirect to dashboard or request_access page

  if (user.admin){
    res.json(unconfirmedAccounts);
  } else {
    user.confirmed ? res.redirect("/dashboard") : res.redirect("/");
  }



  //If no, check if their account is confirmed. 

  //If confirmed, redirect to dashboard

  //If not, redirect to request access page


  // res.render("pages/account_requests", {user, unconfirmedAccounts})
}

// Show dashboard with user's events and list upcoming meetups
async function dashboard(req, res) {
    
  // if "tokens" cookie isn't found
  if (!req.cookies.tokens) {
    // redirect to homepage
    return res.redirect("/")
  }

  // Find current user
  let accessToken = req.cookies.tokens.access_token;
  let user = await User.findOne({ access_token: accessToken });


  //Redirect user if their account is unconfirmed
  if (!user.confirmed) {
    return res.redirect("/account_requests")
  }

  // Find upcoming meetups
  let upcomingMeetups = await axios
    .get(
      `https://api.meetup.com/find/upcoming_events?&sign=true&photo-host=public&topic_category=programming&page=20`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }
    )
    .then(resp => resp.data.events)
    .catch(err => console.error(err));
    

  //Remove events without a venue
  for (let i=0; i < upcomingMeetups.length; i++){ 
    if ( !upcomingMeetups[i].venue) {
      upcomingMeetups.splice(i, 1); 
    }
 }

  // Render the dashboard view and pass objects with data to display.
  res.render("pages/dashboard", { upcomingMeetups, user });
}

async function profile(req, res) {
  // if "tokens" cookie isn't found
  if (!req.cookies.tokens) {
    // redirect to homepage
    return res.redirect("/");
  }

  // Find current user
  let accessToken = req.cookies.tokens.access_token;
  let user = await User.findOne({ access_token: accessToken });
  console.log("user info" + user);

  // Find upcoming meetups
  let upcomingMeetups = await axios
    .get(
      `https://api.meetup.com/find/upcoming_events?&sign=true&photo-host=public&topic_category=programming&page=20`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }
    )
    .then(resp => resp.data.events)
    .catch(err => console.error(err));

  // Render the dashboard view and pass objects with data to display.
  res.render("pages/dashboard", { upcomingMeetups, user });
}

async function toggleConfirmed(req, res) {

   // Find current user
   let accessToken = req.cookies.tokens.access_token;
   let user = await User.findOne({access_token: accessToken});
  
  if (user.confirmed === false){
    console.log('user is unconfirmed');
    await User.findByIdAndUpdate(user._id, {
       confirmed: true
    });
  } else {
    console.log('user is confirmed');

    await User.findByIdAndUpdate(user._id, {
      confirmed: false
    });
  }
  

  res.redirect("/");
}

async function toggleAdmin(req, res) {

  // Find current user
  let accessToken = req.cookies.tokens.access_token;
  let user = await User.findOne({access_token: accessToken});
 
 if (user.admin === false){
   await User.findByIdAndUpdate(user._id, {
      admin: true
   });
 } else {
await User.findByIdAndUpdate(user._id, {
     admin: false
   });
 }
 

 res.redirect("/");
}


module.exports = {
   homepage,
   register,
   dashboard,
   accountRequests,
   toggleConfirmed,
   toggleAdmin
};
