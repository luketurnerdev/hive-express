const express = require("express");
const router = express.Router();
//const eventsRoutes = require("./events_routes");
const pagesController = require("./../controllers/pages_controller");

// Root / Homepage
router.get("/", pagesController.homepage);

// Events Routes
//router.use("/events", eventsRoutes);

module.exports = router;
