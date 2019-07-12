require("dotenv").config();
const express = require("express");
const router = express.Router();
const usersController = require("./../controllers/users_controller");
const authController = require("./../controllers/auth_controller");

//API Keys
const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;
const redirect_uri = process.env.REDIRECT_URI;

// Register page
router.get("/register", authController.index);

// POST to "/register"
// Create a user
router.post("/register", usersController.create);

//Direct the user to authenticate on Meetup.com
//This takes them to a callback route below
router.get('/meetup', (req, res) => 
{
    //TODO: Add the 'scope' parameter in the headers to ask for more permissions, e.g., RSVP access etc.
    //Basic and RSVP
    console.log('meetup route hit');
    res.redirect
        (`https://secure.meetup.com/oauth2/authorize?client_id=${client_id}&response_type=code&redirect_uri=${redirect_uri}`);
});


//Return from meetup auth page and fetch access and refresh tokens
router.get('/callback', authController.meetupAuth);

//If the user already exists in the db,
// run the below code to update their tokens

//PUT / PATCH METHODS 

// router.put("/register", userController.update);
// router.patch("/register", userController.update);

module.exports = router;