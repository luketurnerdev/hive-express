const axios = require("axios");
const queryString = require("query-string");

class meetupService {
    constructor() {
        this.keys = {};

    }

    setItem(key, value) {
        return this.keys[key] = value;
    }

    getItem(key) {
        return this.keys[key];
    }

    async getTokens(code) {
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
            'code': code
        });

        const response = await axios.post
        (
            'https://secure.meetup.com/oauth2/access',
            body,
            config
        );
        return response.data;
    }

    async getUserInfo(accessToken) {
        const response = await axios.get('https://api.meetup.com/members/self', {
            headers: {
                "Authorization": `Bearer ${accessToken}`
            }
        });

        return response.data;
    }
}

module.exports = new meetupService();