//This controller handles the methods for creating, reading, updating and destroying user reviews on events

//User model
const User = require("./../database/models/user_model");
//Event model
const Event = require("./../database/models/event_model");
//Review Model
const Review = require("./../database/models/review_model");

// ** TODO **
  // validate for empty message.
  // (it's required in the schema)

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
      .find({ usrer: user.id })
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
async function create(req, res) {
  // destructure values from req.body
  let {
    user_id: user, // rename user_id to user
    event_id: event, // rename event_id to event
    message: comment // rename message to comment
  } = req.body;

  // dummy data for rating
  let rating = {
    food: 5,
    drinks: 3,
    talks: 1,
    vibe: 4
  };

  //Create db entry
  let review = await Review.create({
    user,
    event,
    comment,
    rating
  })
    .then(response => console.log("Review Created: ", response))
    .catch(err => console.log(err));

  res.redirect("/events");
}

// GET to "events/:id/reviews"
// Display all reviews for a specific event.
async function eventReviews(req, res) {
  // Get event with id from url
  let event = await Event.findById(req.params.id).catch(err =>
    console.log(err)
  );

  // Get reviews associated with that event
  let reviews = await Review.find({ event: req.params.id })
    .populate("user")
    .catch(err => console.log(err));

  res.json([event, reviews]);
}

//Edit a review with the new values
//Rating should be passed in as an object of the 4 categories
async function update(req, res) {
  console.log(req.body);
  let { id, rating, comment } = req.body;
  await Review.update(
    { _id: id },
    {
      $set: {
        rating: rating,
        comment: comment
      }
    }
  )
    .then(item => {
      console.log(`Successfully updated review.`);
    })
    .catch(err => {
      console.log(err);
    });
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
