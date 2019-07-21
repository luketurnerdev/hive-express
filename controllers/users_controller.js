//Import the user model
const User = require("./../database/models/user_model");
const meetupService = require("./../services/meetupService");
const axios = require("axios");

// import findUser function
const findUser = require("./_findUser");

// POST to "/auth/register"
// Create/register a new user or update their tokens if they're already registered.
async function create(req, res, next) {
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

  await User
    .create({
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
    })
    .then(resp => res.status(201).json(resp))
    .catch(err => next(new HTTPError(500, err)));
}

async function updateTokens(id, newValues) {
  await User
    .findOneAndUpdate(
      { meetup_uid: id },
      {
        access_token: newValues.access_token,
        refresh_token: newValues.refresh_token
      },
      { 
        new: true,
        useFindAndModify: false
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
    res.redirect("/account_requests")
  
}

//'delete' is a reserved word, using deleteUser instead
async function deleteUser(req, res) {

  let id = req.params.id;
  console.log(id);
  await User.findByIdAndRemove(id);


  console.log("Deleted user.");
  res.redirect("/account_requests");
}

// GET to "/users/request"
// Display form for user to send a message to admin
async function newAccountRequest(req, res, next) {
  // Find and return the current user's document
  await findUser(req, next)
    .then(resp => res.json(resp))
    .catch(err => console.log(err));
}

// PUT to "/users/request"
function createAccountRequest(req, res) {
  res.send(req.body);
}

async function show(req, res) {
  let user = await User.findById(req.params.id).catch(err => {
    res.status(404).send(err);
  });
  res.render("users/show", { user });
}

module.exports = {
  create,
  updateTokens,
  confirmUser,
  show,
  deleteUser,
  newAccountRequest,
  createAccountRequest
};
