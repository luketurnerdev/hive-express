const Event = require("./../database/models/event_model");
const axios = require("axios");

async function index(req, res) {
  let events = await Event.find().sort({ created_at: "desc" });
  let upcomingMeetups = await axios
    .get(
      `https://api.meetup.com/find/upcoming_events?&sign=true&photo-host=public&topic_category=programming&page=20`
    )
    .then(resp => {
      console.log(resp.data);
      return resp.data;
    })
    .catch(err => console.error(err.message));

  res.render("events/index", { events, upcomingMeetups });
}

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

  let event = await Event.create({
    link,
    name,
    group,
    local_date,
    local_time,
    how_to_find_us,
    attendance_count,
    guest_limit,
    rsvp_limit
  }).catch(err => res.status(500).send(err));

  res.send(req.body);
}

module.exports = { index, create };
