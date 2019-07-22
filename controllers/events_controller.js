const Event = require("./../database/models/event_model");
const axios = require("axios");
// import findUserByToken() function
const findUserByToken = require("./_findUserByToken");

// GET to "/events"
// Show all events in DB
async function index(req, res, next) {
  // Find all events and sort by their creation date
  let events = await Event
    .find()
    .sort({ created_at: "desc" })
    .then(resp => {
      if (resp === null)
        return next(new HTTPError(500, `Failed to find events in database.`));
      else return res.json(resp);
    })
    .catch(err => next(new HTTPError(400, err)));
}

// POST to "/events"
// Create an event and add to DB
async function create(req, res, next) {
  // destructure from values
  let { id, groupUrlname, message } = req.body;
  // if messsage is blank, return an error
  if (!message.trim()) {
    return next(new HTTPError(400, "Message is required and must not be blank."));
  };
  // find user with access_token
  let user = await findUserByToken(req, next);
  
  // get event with req.body.id
  let meetup = axios
    .get(`https://api.meetup.com/${groupUrlname}/events/${id}`, {
      headers: {
        Authorization: `Bearer ${user.access_token}`
      }
    })
    .then(resp => {
      if (!resp.data)
        return next(new HTTPError(500, `Failed to retrieve event data from Meetup API.`));
      else return resp.data;
    })
    .catch(err => next(new HTTPError(400, err)));

  // wait for user and meetup
  await Promise.all([user, meetup])
    .then(async resp => {
      // destructure user and meetup from response
      let [user, meetup] = resp;

      // destructure values from meetup event object
      let {
        id: meetup_id, // rename id to meetup_uid
        name,
        link,
        rsvp_limit,
        status,
        local_date,
        local_time,
        venue: { name: venue_name, address_1: venue_address, city: venue_city },
        group: { name: group_name, urlname: group_urlname },
        description,
        how_to_find_us
      } = meetup;
    
      // create a new event document in the DB
      await Event
        .create({
          meetup_id,
          link,
          name,
          group: {
            name: group_name,
            urlname: group_urlname
          },
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
        })
        .then(resp => {
          if (!resp) 
            return next(new HTTPError(400, "Failed to add the event to the database."))
          else 
            return res.status(201).json(resp);
        })
        .catch(err => next(new HTTPError(500, err)));
    });
}

// GET to "/events/suggest/:id?groupUrlName"
// Display a form for the user to write a message for suggesting/creating an event.
// Returns full event data object from meetup API.
async function newSuggestion(req, res, next) {
  let accessToken = req.cookies.tokens.access_token;
  let group = req.query.group;
  let id = req.params.id;
  // Check for required values
  if (!accessToken) return next(new HTTPError(400, "Could not find access token."));
  if (!group) return next(new HTTPError(400, "Could not find group."));
  // GET request to meetup api
  let meetup = await axios
    .get(`https://api.meetup.com/${group}/events/${id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
    .then(resp => {
      if (!resp.data) 
        return next(new HTTPError(404, "Failed to retrieve event data from Meetup API."))
      else return res.json(resp.data);
    })
    .catch(err => next(new HTTPError(500, err)));
}

// GET to "/events/:id"
// Find (in DB) and show one event's details
async function show(req, res, next) {
  let meetup = await Event
    .findById(req.params.id)
    .catch(err => next(new HTTPError(404, `Could not find event with ID: ${req.params.id}`)));
  res.json(meetup);
}

// GET to "/events/:group/:id"
// Find event data from meetup API
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
    .catch(err => res.status(404).json(err));
    //.catch(err => next(new HTTPError(404, err))); // <-- Err: Cannot set headers after they're sent to client

  res.json(meetup);
}

// GET to "/events/suggestions"
// Display events which are suggested and not recommended
async function suggestions(req, res, next) {
  // Find the current user
  let user = await findUserByToken(req, next);
  // If current user is not an admin, return an error
  if (!user.admin) return next(
      new HTTPError(401, "You must be an admin to view this page.")
    );
  //res.redirect("/dashboard")
  //should we redirect here or on the front-end?

  // Find events suggested by users
  let events = await Event
    .find({
      ca_recommended: false,
      "suggested.is_suggested": true
    })
    .sort({ 
      created_at: "desc" 
    })
    .catch(err => next(new HTTPError(404, "Failed to find suggested events.")));

  res.json(events);
}

// PUT to "/events/recommend/:id"
// Update this event so that ca_recommended = true.
async function recommend(req, res, next) {
  // Find the current user
  // If current user is not an admin, return an error
  let user = await findUserByToken(req, next)
    .then(resp => {
      if (!resp.admin) throw "You must be an admin to view this page."
      else return resp;
    })
    .catch(err => next(new HTTPError(401, err)));
    
  await Event
    .findByIdAndUpdate(
      req.params.id, 
      { ca_recommended: true }, 
      { new: true }
    )
    .then(resp => res.json(resp))
    .catch(err => next(new HTTPError(500, "Failed to update the event.")));
}

// DELETE to "/events/:id"
// Remove this event from the DB
async function destroy(req, res) {
  await Event.findByIdAndRemove(req.params.id);
  res.redirect("/events");
}

/* 
 * Use axios to query Meetup API with a 
 *  GET request to https://api.meetup.com/:group/events/:id
 * Note (Jim): This function has NOT been successfully implemented yet.
 */
async function findMeetupEvent(next, group, id, accessToken) {
  try {
    await axios
      .get(`https://api.meetup.com/${group}/events/${id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
      .then(resp => {
        if (!resp.data) {
          throw new HTTPError(resp.response.status, resp.response.data);
        }
        else {
          console.log(resp.data);
          return resp.data;
        }
      })
  } catch(err) {
    return next(err) 
  };
}

//Attending an event
//put request comes through to express. the db is updated. the response should be the updated event, with
//the new attendee now in the array


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
