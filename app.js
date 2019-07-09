//Express server setup
const express = require('express');
const app = express();
const port = 3000;

//Additional packages

//Passport

const passport = require("./config/passport");
app.use(passport.initialize());

//Root page 
app.get('/', (req,res) => {
    res.send('Testing!');
});

//Meetup API test

app.get('/meetup',
  passport.authenticate('meetup', { session: false }),
  function(req, res) {
    res.json(req.user);
  });

passport.use(new MeetupOAuth2Strategy({
    clientID: MEETUP_KEY,
    clientSecret: MEETUP_SECRET,
    callbackURL: "http://127.0.0.1:3000/auth/meetup/callback",
    autoGenerateUsername: true
  }, function(accessToken, refreshToken, profile, done) {
      return done(null, profile);
  }));


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