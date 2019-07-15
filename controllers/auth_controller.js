//API Keys
const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;
const redirect_uri = process.env.REDIRECT_URI;

//User Model for creation and updating of users
const User = require("./../database/models/user_model");
const usersController = require("./users_controller");

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


            //Take the params that meetup allows us to take and store this in an object
            let userProfileInfo = {
                meetup_uid: userData.id,
                email: userData.email,
                name: userData.name,
                city: userData.city,
                photo: userData.photo.photo_link,
                admin: false,
                confirmed: false,
                created_at: null,
                updated_at: null,
                access_token: tokens.access_token,
                refresh_token: tokens.refresh_token

            }
            //Does the user exist?
            const user =  await User.findOne({"meetup_uid": userProfileInfo.meetup_uid});

            //If user doesn't exist, create it
            if (!user) {
                //Create new user
                const config = { headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }};

                //Put the body data in the correct format
                const body = queryString.stringify(userProfileInfo);


                axios.post(`${process.env.ROOT_SERVER}/auth/register`, body, config)
                .then(function (response) {
                    console.log(`Sucessfully created user ${userData.name}!`);
                })
                .catch(function (error) {
                    console.log(error);
                });
            } else {

                //Update the user's tokens
                // console.log('Updating tokens with ' + tokens.access_token);
                //Call the controller method with the id of document,
                // and the new values to apply
                const newValues = {
                    'access_token' : tokens.access_token,
                    'refresh_token': tokens.refresh_token
                };
                usersController.update(userData.id, newValues);
            }


                

            
            
            
            
            
            // if (user) {
            //     //update user with new access and refresh tokens
            // } else {
            //     usersController.create(userProfileInfo);

            // }
        

        return res.redirect("/");
    } 
 


    


module.exports = {
    meetupRedirect,
    meetupAuth,
    index
}