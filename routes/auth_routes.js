//Imports and express setup
const express = require("express");
const router = express.Router();
const usersController = require("./../controllers/users_controller");
const authController = require("./../controllers/auth_controller");
const pagesController = require("./../controllers/pages_controller");

// Register page
router.get("/register", pagesController.register);

// POST to "/register"
// Create a user
router.post("/register", usersController.create);

//Update a user's tokens
router.put("/register", usersController.updateTokens);

//Direct the user to authenticate on Meetup.com
//This takes them to a callback route below
router.get('/meetup', authController.meetupRedirect);

//Return from meetup auth page and fetch access and refresh tokens
router.get('/callback', authController.meetupAuth);

//If the user already exists in the db,
// run the below code to update their tokens

module.exports = router;