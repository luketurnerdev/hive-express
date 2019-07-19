const express = require("express");
const router = express.Router();
const eventsRoutes = require("./events_routes");
const authRoutes = require("./auth_routes");
const usersRoutes = require("./users_routes");
const reviewsRoutes = require("./reviews_routes");

const pagesController = require("./../controllers/pages_controller");

// Root / Homepage
router.get("/", pagesController.homepage);

// Pending accounts page
router.get("/account_requests", pagesController.accountRequests);

// [DEBUG] Toggle user's 'confirmed' status on and off
router.get("/toggleconfirmed", pagesController.toggleConfirmed);

// [DEBUG] Toggle user's 'admin' status on and off
router.get("/toggleadmin", pagesController.toggleAdmin);

// Dashboard
router.get("/dashboard", pagesController.dashboard);

// Events Routes
router.use("/events", eventsRoutes);

// Auth routes
router.use("/auth", authRoutes);

// Users routes
router.use("/users", usersRoutes);

// Reviews routes
router.use("/reviews", reviewsRoutes);

module.exports = router;
