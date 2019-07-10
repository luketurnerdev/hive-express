//Authenticate the user on Meetup.com and return an access token and refresh token.
const axios = require('axios');
const queryString = require('query-string');
const client_id = "n3i689g0cs3tj2qvt7u92q1ul0";
const client_secret = "tbmduf2gvmitpdrc9b35sjfn7c";
const redirect_uri = "http://localhost:3000/callback";


async function MeetupAuth (req, res) {
        var access_token = "";
        var refresh_token = "";
        
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

    function AccessToken() {
        return access_token;
      }
    
      function RefreshToken() {
        return refresh_token;
      }


module.exports = {
    MeetupAuth,
    AccessToken,
    RefreshToken
}