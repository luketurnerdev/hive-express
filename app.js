//Express server setup
const express = require('express');
const app = express();
const port = 3000;

//Additional packages
const axios = require('axios');
const queryString = require('query-string');
//Passport

const passport = require("./config/passport");
app.use(passport.initialize());

//Root page 
app.get('/', (req,res) => {
    res.send('Testing!');
});

//Meetup API test

app.get('/meetup', (req, res) => {
    res.redirect("https://secure.meetup.com/oauth2/authorize?client_id=n3i689g0cs3tj2qvt7u92q1ul0&response_type=code&redirect_uri=http://localhost:3000/callback");
}

)

app.get('/callback', async (req, res) => {

    const config = { headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    }};
    


    const body = queryString.stringify({
        'client_id':"n3i689g0cs3tj2qvt7u92q1ul0",
        'client_secret':"tbmduf2gvmitpdrc9b35sjfn7c",
        'grant_type': 'authorization_code',
        'redirect_uri': "http://localhost:3000/callback",
        'code':req.query.code
    });


   try {
    const response = await axios.post('https://secure.meetup.com/oauth2/access', body, config);
    console.log(response);
    return res.sendStatus(200);
   } 

   catch(err) {
    console.log(err);
   }
});

app.get('/successful', () => {
    console.log('yay')
});


//Application-level middleware

app.use((req,res) => {
    console.log('Time: ', Date.now());
    next();
});

//Route specific middleware

app.use("/", (req,res,next) => {
    console.log('This is middleware for a specific route.');
});


//Port listening
app.listen(port, () => console.log(`Express running on port ${port}`));