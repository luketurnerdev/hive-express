const express = require("express");
const router = express.Router();
const eventsController = require("./../controllers/events_controller");

// GET to "/events"
// Show All Events
router.get("/", eventsController.index);

// POST to "/events"
// Suggest / Create an event in the DB
router.post("/", eventsController.create);

// GET to "/events/suggest/:id"
// Compose a message to send with the event for suggestion to admin.
router.get("/suggest/:id", eventsController.newSuggestion);

// GET to "/events/suggestions"
// Display events that have been suggested for admin's approval.
// **TODO** RESTRICTED TO: ADMIN ONLY
router.get("/suggestions", eventsController.suggestions);

// GET to "/events/:id"
// Show One Event
router.get("/:id", eventsController.show);

// DELETE to "/events/:id"
// Remove event from the DB
router.delete("/:id", eventsController.destroy);

// PUT to "/events/recommend/:id"
// Update a suggested event to be recommended
router.put("/recommend/:id", eventsController.recommend);

// GET to "/events/:group/:id"
// Show One Meetup (that isn't saved yet)
router.get("/:group/:id", eventsController.showMeetup);

module.exports = router;
