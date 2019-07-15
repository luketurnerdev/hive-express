const express = require("express");
const router = express.Router();
const eventsController = require("./../controllers/events_controller");

// GET to "/events"
// Show All Events
router.get("/", eventsController.index);

// POST to "/events"
// Create an Event
router.post("/", eventsController.create);

// GET to "/events/:id"
// Show One Event
router.get("/:id", eventsController.show);

// GET to "/events/suggest/:id"
// Compose a message to send with the event for suggestion to admin.
router.get("/suggest/:id", eventsController.newSuggestion);

// **TODO** POST to "/events/suggest/:id"
//          Save the suggestion

// GET to "/events/:group/:id"
// Show One Meetup (that isn't saved yet)
router.get("/:group/:id", eventsController.showMeetup);

module.exports = router;
