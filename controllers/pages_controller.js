const User = require("./../database/models/user_model");
const findUserByToken = require("./_findUserByToken");
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
async function accountRequests(req, res, next) {
  //Make a list of unconfirmed accounts
  let unconfirmedAccounts = await User
    .find({ confirmed: false })
    .sort({ created_at: "desc" })
    .then(resp => {
      if (!resp) return next(new HTTPError(404, "Failed to find unconfirmed users in database."))
      else return resp;
    })
    .catch(err => next(new HTTPError(500, err)));

  // Find current user
  await findUserByToken(req, next)
    //Check if user is admin
    .then(resp => {
      // if not an admin
      if (!resp.admin) {
        // if not confirmed - redirect newAccountRequest page
        if (!resp.confirmed) return res.redirect("/users/request")
        // if confirmed - redirect to dashboard
        else return res.redirect("/dashboard");
      } 
      // if admin - respond with unconfirmedAccounts
      else return res.json(unconfirmedAccounts);
    })
    .catch(err => next(new HTTPError(500, err)));
}

// GET to "/dashboard"
// Show dashboard with user's events and list upcoming meetups
async function dashboard(req, res, next) {
  // find current user
  let user = await findUserByToken(req, next);
  // if user is not confirmed
  if (!user.confirmed) {
    // redirect to account requests
    //(which will redirect unconfirmed user to newAccountRequest page)
    console.log("redirecting unconfirmed user to /account_requests");
    return res.redirect("/account_requests")
  };

  // Find upcoming meetups
  let upcomingMeetups = await axios
    .get(
      `https://api.meetup.com/find/upcoming_events?&sign=true&photo-host=public&topic_category=programming&page=20`,
      {
        headers: {
          Authorization: `Bearer ${user.access_token || req.cookies.tokens.access_token}`
        }
      }
    )
    .then(resp => {
      // check for null response
      if (!resp.data){
        console.log("no events")
        return next(new HTTPError(404, "Failed to retreive upcoming meetups from Meetup API."))
      }
      // return the events array
      else return resp.data.events;
    })
    .then(resp => {
      // remove events without a venue
      for (let i=0; i < resp.length; i++){ 
        if (!resp[i].venue) resp.splice(i, 1);
      }
      // return the events array
      return resp;
    })
    .catch(err => next(new HTTPError(500, err)));
    
  // respond with user document and upcoming meetups array
  return res.json([user, upcomingMeetups]);
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
