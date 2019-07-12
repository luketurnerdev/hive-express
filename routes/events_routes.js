const express = require("express");
const router = express.Router();
const eventsController = require("./../controllers/events_controller");

// all paths are preceeded by "/events"

// GET to "/events"
// Show All Events
router.get("/", eventsController.index);

// POST to "/events"
// Create an Event
router.post("/", eventsController.create);

// GET to "/events/:id"
// Show One Event
router.get("/:id", eventsController.show);

module.exports = router;
