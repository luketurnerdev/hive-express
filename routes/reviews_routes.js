//This file contains routes for reviews, however, routes attached
//To specific events are in events_routes.
const express = require("express");
const router = express.Router();
const reviewsController = require("./../controllers/reviews_controller");

//Post a new review
router.post("/", reviewsController.create);

//View all reviews
router.get("/", reviewsController.index);

module.exports = router;

