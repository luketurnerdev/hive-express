//This is a test file for creating new users

const express = require("express");
const router = express.Router();
const usersController = require("./../controllers/users_controller");
const { celebrate, Joi } = require("celebrate");

// all paths are preceeded by "/"
router.get("/", eventsController.index);

// POST to "/events"
// Create an Event
router.post("/", eventsController.create);

module.exports = router;

app.post("/routes/user_test_route", celebrate({
    body: {
        title: Joi.string().required(),
        url: Joi.string().required()
    }
}), BookmarkController.create);