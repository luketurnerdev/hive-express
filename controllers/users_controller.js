//Import the user model
const User = require("./../database/models/user_model");
const meetupService = require("./../services/meetupService");
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
    name,
    city,
    photo,
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
    name,
    city,
    photo,
    admin,
    confirmed,
    access_token,
    refresh_token,
    created_at,
    updated_at
  }).then(response => {
    console.log("Successfully created new user!")
  }).catch(err => res.status(500).send(err));

  res.send(req.body);
}

async function updateTokens(id, newValues) {
  await User.update(
    { meetup_uid: id },
    {
      $set: {
        access_token: newValues.access_token,
        refresh_token: newValues.refresh_token
      }
    }
  )
    .then(item => {
      console.log(`Successfully updated access tokens for user with id: ${id}`);
    })
    .catch(err => {
      console.log(err);
    });
}

async function confirmUser(req, res) {


    let id = req.params.id || null;
    await User.update(
    { _id: id },
    {
      $set: {
          confirmed:true
      }
    }
  )
    .then(item => {
      console.log(`Successfully confirmed user with id: ${id}`);
    })
    .catch(err => {
      console.log(err);
    });
    res.redirect("/accountrequests")
  
}

//'delete' is a reserved word, using deleteUser instead
async function deleteUser(req, res) {

  let id = req.params.id;
  console.log(id);
  await User.findByIdAndRemove(id);


  console.log("Deleted user.");
  res.redirect("/accountrequests");
}


async function show(req, res) {
  let user = await User.findById(req.params.id).catch(err => {
    res.status(404).send(err);
  });
  res.render("users/show", { user });
}


module.exports = {
  index,
  create,
  updateTokens,
  confirmUser,
  show,
  deleteUser
};
