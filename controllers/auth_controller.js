//API Keys
const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;
const redirect_uri = process.env.REDIRECT_URI;

//Packages / Imports
require("dotenv").config();
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

        //Define the headers as using URL-encoded format
        const config = { headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }};
    
        //Client auth information to be used in the body.
        //Use queryString.stringify to convert this information to url-encoded from JSON.
        const body = queryString.stringify({
            'client_id': process.env.CLIENT_ID,
            'client_secret':process.env.CLIENT_SECRET,
            'grant_type': 'authorization_code',
            'redirect_uri': process.env.REDIRECT_URI,
            'code':req.query.code
        });
    
    
       try {
        //If auth successful, provide the response (including access and refresh token)
        const response = await axios.post
        (
            'https://secure.meetup.com/oauth2/access',
            body,
            config
        );

        //Use a singleton pattern to store the tokens
        //THIS IS A TEMPORARY SOLUTION - will store this info in the database later
        //TODO - replace 'current-user' with user ID from database
        meetupService.setItem("current-user", {
            "access_token": response.data.access_token,
            "refresh_token": response.data.refresh_token
        });

        console.log("Access token: " + response.data.access_token);
        return res.redirect("/");
    } 
    
       catch(err) {
        console.log(err);
       }


    }


    


module.exports = {
    meetupRedirect,
    meetupAuth,
    index
}