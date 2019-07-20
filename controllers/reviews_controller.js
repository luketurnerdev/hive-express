//This controller handles the methods for creating, reading, updating and destroying user reviews on events

//User model
const User = require("./../database/models/user_model");
//Event model
const Event = require("./../database/models/event_model");
//Review Model
const Review = require("./../database/models/review_model");

// GET to "/reviews"
// Show all reviews to admin
// or Show current user's reviews to non-admin
async function index(req, res, next) {
  // find current user with access token
  let user = await findUser(req, next);

  // if user is an admin
  if (user.admin === true) {
    // find all reviews
    let reviews = await Review
      .find()
      .sort({ created_at: "desc" })
      .catch(err => next(new HTTPError(404, "Failed to find reviews.")));

    return res.json(reviews);
  }
  else {
    // find all of the user's reviews
    let reviews = await Review
      .find({ user: user.id })
      .catch(err => next(new HTTPError(404, "Failed to find user's reviews.")));

    return res.json(reviews);
  }
}

// GET to "/events/:id/new_review"
// Display form for the user to leave a review for an event.
async function newReview(req, res, next) {
  // find event with :id from params
  let event = await Event
    .findById(req.params.id)
    .catch(err => next(new HTTPError(404, "Failed to find event.")));

  // find current user with access token in cookies
  let user = await findUser(req, next);

  res.json([event, user.id]);
  //res.render("reviews/new_review", { event, user_id });
}

// POST to "/reviews"
// Create a review in the database when the user submits form.
async function create(req, res, next) {
  // destructure values from req.body
  let {
    user_id: user,   // rename user_id to user
    event_id: event, // rename event_id to event
    message: comment // rename message to comment
  } = req.body;

  // if comment is blank, return an error
  if (!comment.trim()) {
    return next(new HTTPError(400, "Comment is required and must not be blank."));
  };

  // dummy data for rating
  let rating = { food: 5, drinks: 3, talks: 1, vibe: 4 };

  //Create db entry
  let review = await Review
    .create({ user, event, comment, rating })
    .then(resp => res.json(resp))
    .catch(err => next(new HTTPError(400, "Failed to add review to database.")));

  return review;
}

// GET to "events/:id/reviews"
// Display all reviews for a specific event.
async function eventReviews(req, res, next) {
  // destructure id from req.params
  let { id } = req.params;

  // Get event with id from url
  let event = await Event
    .findById(id)
    .then(resp => {
      // if null response, return an error
      if (!resp) next(new HTTPError(404, `Could not find event with id: ${id}`));
      else return resp;
    })
    .catch(err => next(new HTTPError(404, err)));

  // Get reviews associated with that event
  let reviews = await Review
    .find({ event: req.params.id })
    .populate("user")
    .catch(err => next(new HTTPError(404, err)));

  return res.json([event, reviews]);
}

// PUT to "/reviews"
// Update a review in the database
async function update(req, res, next) {
  let { id, rating, comment } = req.body;

  // check presence of values in request body
  if (!id) next(new HTTPError(400, "No valid review 'id' value in request body."));
  if (!rating) next(new HTTPError(400, "No valid 'rating' value in request body."));
  if (!comment.trim()) next(new HTTPError(400, "No valid 'comment' value in request body."));
  
  // update the review and return the updated document
  let review = await Review
    .findByIdAndUpdate(id, { rating, comment }, { new: true })
    .catch(err => next(new HTTPError(500, err)));
  
  return res.json(review);
}

/*  
 *  Find a user in the database using the access_token stored in cookies.
 *  If unsuccessful, call error handler middleware.
 */
async function findUser(req, next){
  try {
    // get access token from cookies
    let accessToken = req.cookies.tokens.access_token;
    // check the token
    if (!accessToken) throw new HTTPError(404, "Missing user's access_token.");

    // find user with access token
    return await User
      .findOne({ access_token: accessToken })
      .then(resp => {
        // check the response
        if (!resp) throw new HTTPError(404, "User not found.");
        else return resp;
      })
    } catch(err) {
    // If errors, return with error middleware
    return next(err);
  };
}

module.exports = {
  newReview,
  create,
  index,
  eventReviews,
  update
};
