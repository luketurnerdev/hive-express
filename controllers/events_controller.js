const Event = require("./../database/models/event_model");
const User = require("./../database/models/user_model");
const axios = require("axios");

// GET to "/events"
// Show all events in DB
async function index(req, res) {
  //Create a list of events sorted by their creation date
  let events = await Event.find().sort({ created_at: "desc" });

  res.render("events/index", { events });
}

// POST to "/events/create"
// Create an event and add to DB
async function create(req, res) {
  let { id, message } = req.body;
  
  // get user with access_token
  let accessToken = req.cookies.tokens.access_token;
  let user = await User.findOne({access_token: accessToken});

  // get event with req.params.id
  // destructure necessary values from event data
  // create a new event document in the DB
  // 
  // let {
  //   link,
  //   name,
  //   group,
  //   local_date,
  //   local_time,
  //   how_to_find_us,
  //   attendance_count,
  //   guest_limit,
  //   rsvp_limit
  // } = req.body;
  

  // let event = await Event.create({
  //   link,
  //   name,
  //   group,
  //   local_date,
  //   local_time,
  //   how_to_find_us,
  //   attendance_count,
  //   guest_limit,
  //   rsvp_limit
  // }).catch(err => res.status(500).send(err));

  // res.redirect("/events");
}

// GET to "/events/suggest/:id"
// Display a form for the user to write a message for suggesting/creating an event.
async function newSuggestion(req, res) {
  //Render the suggestion form with the event info from request params
  let accessToken = req.cookies.tokens.access_token;
  let group = req.query.group;
  let id = req.params.id;

  let meetup = await axios
    .get(`https://api.meetup.com/${group}/events/${id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
    .then(resp => resp.data)
    .catch(err => console.error(err));

  res.render("events/suggest", { meetup });
}

// GET to "/events/:id"
// Find (in DB) and show one event's details
async function show(req, res) {
  let meetup = await Event.findById(req.params.id).catch(err =>
    res.status(404).send(err)
  );
  res.render("events/show", { meetup });
}

// GET to "/events/:group/:id"
// Request and display event data from meetup API
async function showMeetup(req, res) {
  let { group, id } = req.params;
  let accessToken = req.cookies.tokens.access_token;

  let meetup = await axios
    .get(`https://api.meetup.com/${group}/events/${id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
    .then(resp => resp.data)
    .catch(err => console.error(err));

  res.render("events/show", { meetup });
}

// GET to "/events/suggestions"
// Display events which are suggested and not recommended
async function suggestions(req, res) {
  // Find suggested events
  let events = await Event.find({
    ca_recommended: false,
    "suggested.is_suggested": true
  });

  // Pass the suggested events to the view
  res.render("events/suggestions", { events });
}

// PUT to "/events/recommend/:id"
// Update this event so that ca_recommended = true.
async function recommend(req, res) {
  await Event.findByIdAndUpdate(req.params.id, {
    ca_recommended: true
  });
  res.redirect("/events/suggestions");
}

// DELETE to "/events/:id"
// Remove this event from the DB
async function destroy(req, res) {
  await Event.findByIdAndRemove(req.params.id);
  res.redirect("/events");
}

module.exports = {
  index,
  create,
  show,
  showMeetup,
  newSuggestion,
  suggestions,
  recommend,
  destroy
};
