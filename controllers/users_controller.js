//Import the user model
const User = require("./../database/models/user_model");
const axios = require("axios");

function index(req, res) {
    res.send("Users index");
  }

//Import access and refresh tokens from authorization
//Do get request here for user info, store it in a variable and then write it to the DB


async function create(req, res) {
    let {
      meetup_uid,
      email,
      password,
      firstName,
      lastName,
      city,
      avatar,
      admin,
      confirmed,
      access_token,
      refresh_token,
      created_at,
      updated_at
    } = req.body;

    let user = await User.create({
      meetup_uid,
      email,
      password,
      firstName,
      lastName,
      city,
      avatar,
      admin,
      confirmed,
      access_token,
      refresh_token,
      created_at,
      updated_at
      }).catch(err =>
        res.status(500).send(err)
      );

      console.log(user);
      //Save new user into the database

      user.save().then (user => {
        res.send('User saved to database!');
      }) .catch(error => {
        res.status(400).send("Unable to save the database.");
      })
      
      res.send(req.body);

}

// async function create(req, res) {
    // const { meetup_uid, email, password, firstName, lastName, city, avatar, admin, confirmed, access_token, refresh_token, created_at, updated_at } = req.body;
    // req.user.bookmarks.push({ title, url });
    // await req.user.save();
    // res.json(req.body);
// }

module.exports = {
    index,
    create
}