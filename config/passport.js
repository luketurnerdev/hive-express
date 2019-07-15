//Passport config will go here for authorising users to access either student or admin data.

const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./../database/models/user_model");
