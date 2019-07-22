//Import the user model
const User = require("./../database/models/user_model");
const findUserByToken = require("./_findUserByToken");

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

// PUT to "/auth/register"
// Update the user's tokens in the database.
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
    .then(resp => res.json(resp))
    .catch(err => new HTTPError(500, err));
}

// PUT to "/users/confirm/:id"
// Set a user's confirmed value to true in the database.
async function confirmUser(req, res, next) {
  let id = req.params.id;
  await User
    .findByIdAndUpdate(id, { confirmed: true }, { new: true })
    .then(resp => {
      if (!resp) return next(new HTTPError(404, `Can't find user with id: ${id}`))
      else return res.json(resp);
    })
    .catch(err => next(new HTTPError(400, err)));
    //res.redirect("/account_requests")
}

// DELETE to "/users/:id"
// Remove a user from the database
async function deleteUser(req, res, next) {
  let id = req.params.id;
  await User
    .findByIdAndRemove(id, { useFindAndModify: false })
    .then(resp => {
      if (!resp) return next(new HTTPError(404, `Can't find user with id: ${id}`))
      else return res.json(resp);
    })
    .catch(err => next(new HTTPError(400, err)));
}

// GET to "/users/request"
// Display form for user to send a message to admin
async function newAccountRequest(req, res, next) {
  // Find and return the current user's document
  await findUserByToken(req, next)
    .then(resp => res.json(resp))
    .catch(err => console.log(err));
}

// PUT to "/users/request"
// Update a user's document with an account request message
async function createAccountRequest(req, res, next) {
  let { id, request_message } = req.body;
  // if message is empty, return an error
  if (!request_message.trim()) {
    return next(new HTTPError(400, "Message is required and must not be blank."))
  }
  await User
    .findByIdAndUpdate(id, { request_message }, { new: true })
    .then(resp => {
      if (!resp) return next(new HTTPError(404, `Can't find user with id: ${id}`))
      else return res.json(resp);
    })
    .catch(err => next(new HTTPError(400, err)));
}

// GET to "/users/:id"
// Show a user's profile
async function show(req, res, next) {
  let id = req.params.id;
  await User
    .findById(id)
    .then(resp => {
      if (!resp) return next(new HTTPError(404, `Can't find user with id: ${id}`))
      else return res.json(resp);
    })
    .catch(err => next(new HTTPError(400, err)));
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
