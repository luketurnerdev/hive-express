const express = require("express");
const router = express.Router();
const eventsRoutes = require("./events_routes");
const authRoutes = require("./auth_routes");

const pagesController = require("./../controllers/pages_controller");

// Root / Homepage
router.get("/", pagesController.homepage);

// Register page
router.get("/auth/register", pagesController.register);

// Events Routes
router.use("/events", eventsRoutes);

//Auth routes
router.use("/auth", authRoutes);

module.exports = router;
