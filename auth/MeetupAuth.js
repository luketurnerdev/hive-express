//Authenticate the user on Meetup.com and return an access token and refresh token.
const axios = require('axios');
const queryString = require('query-string');
let access_token = "";
let refresh_token = "";

const MeetupAuth = async (req, res) => {
        console.log('This is the meetup authorization js file.')

        //Define the headers as using URL-encoded format
        const config = { headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }};
    
        //Client auth information to be used in the body.
        //Use queryString.stringify to convert this information to url-encoded from JSON.
        const body = queryString.stringify({
            'client_id':"n3i689g0cs3tj2qvt7u92q1ul0",
            'client_secret':"tbmduf2gvmitpdrc9b35sjfn7c",
            'grant_type': 'authorization_code',
            'redirect_uri': "http://localhost:3000/callback",
            'code':req.query.code
        });
    
    
       try {
        //If auth successful, provide the response (including access and refresh token)
        const response = await axios.post('https://secure.meetup.com/oauth2/access', body, config);
        console.log(`Access token: ${response.data.access_token}. Refresh token: ${response.data.refresh_token}`);
        access_token = response.data.access_token;
        refresh_token = response.data.refresh_token;
        return res.redirect("/");
        return res.statusCode(200);
    } 
    
       catch(err) {
        console.log(err);
       }


    }
   
module.exports = MeetupAuth;