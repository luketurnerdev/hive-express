const Event = require("./../database/models/event_model");
const axios = require("axios");

/*
  // GET to "/"
  // Show all events
*/
async function index(req, res) {
  let events = await Event.find().sort({ created_at: "desc" });
  let upcomingMeetups = await axios
    .get(
      `https://api.meetup.com/find/upcoming_events?&sign=true&photo-host=public&topic_category=programming&page=20`,
      {
        headers: {
          "Authorization": "Bearer 98a5e98c4d17a532c8c6499129b78e9b"
        }
      }
    )
    .then(resp => resp.data.events)
    .catch(err => console.error(err));

  res.render("events/index", { events, upcomingMeetups });
}

/*
  // POST to "/create"
  // Create an event
*/
async function create(req, res) {
  let {
    link,
    name,
    group,
    local_date,
    local_time,
    how_to_find_us,
    attendance_count,
    guest_limit,
    rsvp_limit
  } = req.body;

  let event = await Event
    .create({
      link,
      name,
      group,
      local_date,
      local_time,
      how_to_find_us,
      attendance_count,
      guest_limit,
      rsvp_limit
    })
    .catch(err => res.status(500).send(err));

  res.send(req.body);
}

/*
  // GET to "/:id"
  // Show one event
*/
async function show(req, res) {
  let event = await Event
    .findById(req.params.id)
    .catch(err => res.status(404).send(err));
  res.render("events/show", { event })
}

module.exports = { 
  index, 
  create, 
  show 
};
