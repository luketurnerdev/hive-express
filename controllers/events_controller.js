const Event = require("./../database/models/event_model");
const User = require("./../database/models/user_model");
const axios = require("axios");

// GET to "/events"
// Show all events in DB
async function index(req, res) {
  // Find all events and sort by their creation date
  let events = await Event.find().sort({ created_at: "desc" });
  // pass list of events to the view
  return res.json(events);
}

// POST to "/events/create"
// Create an event and add to DB
async function create(req, res) {
  // destructure from values
  let { id, groupUrlname, message } = req.body;

  // ** TODO **
  // validate for empty message.
  // (it's required in the schema)

  // ** TODO **
  // Handle events with no venue...
  // Maybe just don't recommend those in dashboard

  // get user with access_token
  let accessToken = req.cookies.tokens.access_token;
  let user = await User.findOne({ access_token: accessToken }).catch(err =>
    console.error(
      `COULD NOT FIND USER WITH access_token: ${accessToken}\n`,
      err.message
    )
  );

  // get event with req.body.id
  let meetup = await axios
    .get(`https://api.meetup.com/${groupUrlname}/events/${id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
    .then(resp => resp.data)
    .catch(err => console.error(`COULD NOT FIND EVENT\n`, err.message));

  // destructure necessary values from meetup
  let {
    id: meetup_id, // rename id to meetup_uid
    name,
    link,
    rsvp_limit,
    status,
    local_date,
    local_time,
    venue: { name: venue_name, address_1: venue_address, city: venue_city },
    group: { name: group },
    description,
    how_to_find_us
  } = meetup;

  // create a new event document in the DB
  let event = await Event.create({
    meetup_id,
    link,
    name,
    group,
    local_date,
    local_time,
    status,
    location: {
      name: venue_name,
      address: venue_address,
      city: venue_city,
      how_to_find_us: how_to_find_us
    },
    rsvp_limit,
    description,
    attendees: [],
    hive_attendees: [],
    suggested: {
      is_suggested: true,
      suggested_by: user.id,
      message: message
    }
  });

  // Redirect to events index.
  res.redirect("/events");
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

  //Restrict this page to admins only
  let accessToken = req.cookies.tokens.access_token;
  let user = await User.findOne({ access_token: accessToken });

  if (!user.admin) {
    res.redirect("/dashboard");
  }

  // Find suggested events
  let events = await Event.find({
    ca_recommended: false,
    "suggested.is_suggested": true
  }).sort({ created_at: "desc" });

  // Pass the suggested events to the view
  res.json(events);
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

async function findUser(req, res){
  let accessToken = req.cookies.tokens.access_token;
  if (accessToken) {
    let user = await User.findOne({ access_token: accessToken })
    .then(user => {
      return user;
    })
    .catch(err =>
    console.error(
      `COULD NOT FIND USER WITH access_token: ${accessToken}\n`,
      err.message
  )
);
  } else {
    res.redirect("/");
  }
  
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
