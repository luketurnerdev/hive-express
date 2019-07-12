//API Keys
const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;
const redirect_uri = process.env.REDIRECT_URI;

//User Model for creation and updating of users
const User = require("./../database/models/user_model");
const userController = require("./users_controller");

//Packages / Imports

const axios = require('axios');
const queryString = require('query-string');
const meetupService = require('../services/meetupService');


// /auth/register
function index (req, res) {
    res.send('This is the register page.');
}

/*
    Authenticate the user on Meetup.com and return an access token and refresh token.
    These tokens are stored in the database and are updated upon re-authorization
*/

function meetupRedirect(req, res) {
        //TODO: Add the 'scope' parameter in the headers to ask for more permissions, e.g., RSVP access etc.
        //Basic and RSVP
        const scope = {};
        res.redirect
            (`https://secure.meetup.com/oauth2/authorize?client_id=${client_id}&response_type=code&redirect_uri=${redirect_uri}`);
        };

async function meetupAuth (req, res) {
        
        console.log('This is the meetup authorization js file.')

       const tokens = await meetupService.getTokens(req.query.code);
       const userData = await meetupService.getUserInfo(tokens.access_token);
        //axios request for user data.
        //store it in a var
        // check if it exists in the db
        // if not, create
        // if it does, update

        console.log(userData);

            //Take the params that meetup allows us to take and store this in an object
            let userProfileInfo = {
                meetup_uid: userData.id,
                email: userData.email,
                firstName: userData.name,
                city: userData.city,
                avatar: userData.photo.photo_link,
                access_token: userData.access_token,
                refresh_token: userData.refresh_token

            }
            let testObj = {
                // meetup_uid: 123,
                email: 'sfe@Sent.com',
                password: 'password',
                firstName :'sirius',
                lastName: 'black',
                city: 'texas',
                avatar: 'avatar.com',
                admin: false,
                confirmed: false,
                access_token: 'abc123',
                refresh_token: 'abc123',
                created_at: 1234,
                updated_at: 1245
            }
            //Does the user exist?
            const user =  await User.findOne({"meetup_uid": userProfileInfo.meetup_uid})
            if (user) {
                //update user with new access and refresh tokens
            } else {
                userController.create(testObj);
                // console.log('make a new user')
            }
        

        return res.redirect("/");
    } 
 


    


module.exports = {
    meetupRedirect,
    meetupAuth,
    index
}