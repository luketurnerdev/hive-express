const passport = require("passport");
const MeetupOAuth2Strategy = require('passport-oauth2-meetup').Strategy;
//Insert User model reference here

passport.use(new MeetupOAuth2Strategy({
    clientID: n3i689g0cs3tj2qvt7u92q1ul0,
    clientSecret: tbmduf2gvmitpdrc9b35sjfn7c,
    callbackURL: "http://localhost:3000/callback",
    autoGenerateUsername: true
  }, function(accessToken, refreshToken, profile, done) {
      return done(null, profile);
  })
  
);
  
module.exports = passport;