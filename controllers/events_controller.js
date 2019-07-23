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

//PUT to /events/attend/:id
//Toggle user attendance
async function toggleAttendance(req, res, next) {
  let id = req.params.id;
  //Find the user
  let user = await findUserByToken(req, next)
  //Find the event
  let event = await Event
    .findById(id)
    .then(resp => {
      // check for null response
      if (!resp) return next(new HTTPError(404, `Couldn't find event with id: ${id}`));
      else return resp;
    })
    .catch(err => next(new HTTPError(500, err)));

  // Add user to attendees array if not attending,
  // or remove them if they are
  let newList = event.hive_attendees;
  (event.hive_attendees.includes(user.id)) ? newList.splice(newList.indexOf(user.id), 1) : newList.push(user.id);
  
  //Update event in DB with list of hive_attendees
  await Event
    .findByIdAndUpdate(
      id,
      { hive_attendees: newList },
      { new: true, useFindAndModify: false }
    )
    .then(resp => {
      if (!resp) return next(new HTTPError(404, `Failed to update event with id: ${id}`))
      else return res.json(resp);
    })
    .catch(err => next(new HTTPError(500, err)));
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
    .then(resp => {
      if (resp === null) 
        return next(new HTTPError(404, `Could not find event with ID: ${req.params.id}`))
      else return res.json(resp);
    })
    .catch(err => next(new HTTPError(500, err)));
}

// GET to "/events/:group/:id"
// Find event data from meetup API
async function showMeetup(req, res, next) {
  let { group, id } = req.params;
  let accessToken = req.cookies.tokens.access_token;
  // if no access token, return an error
  if (!accessToken) {
    return next(new HTTPError(400, "Could not find access token in cookies."))
  }
  await axios
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

// GET to "/events/suggestions"
// ACCESS: ADMIN ONLY
// Display events which are suggested and not recommended
async function suggestions(req, res, next) {
  console.log('here');
  // Find the current user
  let user = await findUserByToken(req, next);
  console.log(user);
  // If current user is not an admin, return an error
  if (!user.admin) {
    return next(new HTTPError(401, "You must be an admin to view this page."));
  }
  // Find events suggested by users
  await Event
    .find({
      ca_recommended: false,
      "suggested.is_suggested": true
    })
    .sort({ created_at: "desc" })
    .then(resp => {
      if (resp === null)
        return next(new HTTPError(404, "Failed to find suggested events."))
      else return res.json(resp);
    })
    .catch(err => next(new HTTPError(500, err)));
}

// PUT to "/events/recommend/:id"
// Update this event so that ca_recommended = true.
async function recommend(req, res, next) {
  let id = req.params.id;
  // Find the current user
  let user = await findUserByToken(req, next);
  // If current user is not an admin, return an error
  if (!user.admin) {
    return next(new HTTPError(401, "You must be an admin to view this page."));
  }
  // Update the event
  await Event
    .findByIdAndUpdate(
      id, 
      { ca_recommended: true }, 
      { new: true }
    )
    .then(resp => {
      if (resp === null)
        return next(new HTTPError(404, `Could not find event with id: ${id}.`))
        else return res.json(resp);
    })
    .catch(err => next(new HTTPError(500, err)));
}

// DELETE to "/events/:id"
// Remove this event from the DB
async function destroy(req, res) {
  let id = req.params.id;
  await Event
    .findByIdAndRemove(id, { useFindAndModify: false })
    .then(resp => {
      if (resp === null)
        return next(new HTTPError(404, `Could not find event with id: ${id}.`))
      else return res.json(resp);
    })
    .catch(err => next(new HTTPError(500, err)));
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



module.exports = {
  index,
  create,
  toggleAttendance,
  show,
  showMeetup,
  newSuggestion,
  suggestions,
  recommend,
  destroy
};
