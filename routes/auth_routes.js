//Imports and express setup
const express = require("express");
const router = express.Router();
const usersController = require("./../controllers/users_controller");
const authController = require("./../controllers/auth_controller");

// Register page
router.get("/register", authController.index);

// POST to "/register"
// Create a user
router.post("/register", usersController.create);

//Update a user's tokens
router.put("register", usersController.update);

//Direct the user to authenticate on Meetup.com
//This takes them to a callback route below
router.get('/meetup', authController.meetupRedirect);

//Return from meetup auth page and fetch access and refresh tokens
router.get('/callback', authController.meetupAuth);

//If the user already exists in the db,
// run the below code to update their tokens

//PUT / PATCH METHODS 

// router.put("/register", userController.update);
// router.patch("/register", userController.update);

module.exports = router;