/*
    Authenticate the user on Meetup.com and return an access token and refresh token.
    These tokens are stored in the database and are updated upon re-authorization
*/

const axios = require('axios');
const queryString = require('query-string');
const meetupService = require('../services/meetupService');

async function MeetupAuth (req, res) {
        
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
        return res.redirect("/");
    } 
    
       catch(err) {
        console.log(err);
       }


    }


module.exports = {
    MeetupAuth
}