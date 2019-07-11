//Authenticate the user on Meetup.com and return an access token and refresh token.
const axios = require('axios');
const session = require('express-session');
const queryString = require('query-string');
const client_id = "n3i689g0cs3tj2qvt7u92q1ul0";
const client_secret = "tbmduf2gvmitpdrc9b35sjfn7c";
const redirect_uri = "http://localhost:3000/callback";

var access_token = "";
var refresh_token = "";

// function AccessToken() 
//     {
// return MeetupAuth().access_token;
//     }

async function MeetupAuth (req, res) {
        
        
        console.log('This is the meetup authorization js file.')

        //Define the headers as using URL-encoded format
        const config = { headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }};
    
        //Client auth information to be used in the body.
        //Use queryString.stringify to convert this information to url-encoded from JSON.
        const body = queryString.stringify({
            'client_id': client_id,
            'client_secret':client_secret,
            'grant_type': 'authorization_code',
            'redirect_uri': redirect_uri,
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

        //Save tokens into session storage.

        // Window.sessionStorage.setItem('access_token', response.data.access_token);
        // sessionStorage.setItem('refresh_token', response.data.refresh_token);
        sessionStorage.setItem("name", "Garret");

        // let token = sessionStorage.getItem('access_token');
        // console.log("Retrieved access token from session storage:" + token);
        
        // Once we get token, post request to meetup's user page, and create new user with meetup info
        // Then ask them to 'complete their profile' with other information that is not on meetup
        // probably user meetup id
        // if meetup id is not in user table, make a new account.
        // if it is, log them in
        
        //When user logs in, create a new session with access and rfrehs tokens
        //the hive is the source of truth for attendance etc
        //Maybe have colour coding for descrepencies between meetup and the hive
        //login and signup are the same button - just different comparisons

        // Save data to sessionStorage
        // sessionStorage.setItem('key', 'value');

        // // Get saved data from sessionStorage
        // let data = sessionStorage.getItem('key');

        // // Remove saved data from sessionStorage
        // sessionStorage.removeItem('key');

        // // Remove all saved data from sessionStorage
        // sessionStorage.clear();



        return res.redirect("/");
    } 
    
       catch(err) {
        console.log(err);
       }


    }


module.exports = {
    MeetupAuth
}