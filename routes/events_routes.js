const express = require("express");
const router = express.Router();
const eventsController = require("./../controllers/events_controller");

// all paths are preceeded by "/events"
router.get("/", eventsController.index);

module.exports = router;
