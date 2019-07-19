//This controller handles the methods for creating, reading, updating and destroying user reviews on events

//User model
const User = require("./../database/models/user_model");
//Event model
const Event = require("./../database/models/event_model");
//Review Model
const Review = require("./../database/models/review_model");

// GET to "/reviews"
// Show all reviews to admin
async function index(req, res) {
  // if "tokens" cookie isn't found
  if (!req.cookies.tokens) {
    // redirect to homepage
    return res.redirect("/");
  }

  // find user with accessToken
  let accessToken = req.cookies.tokens.access_token;
  let user = await User.findOne({ access_token: accessToken }).catch(err =>
    console.log(err)
  );

  // if user is an admin
  if (user.admin === true) {
    // find all reviews
    console.log("User is an admin");
    let reviews = await Review.find()
      .sort({ created_at: "desc" })
      .catch(err => console.log(err));

    return res.json(reviews);
  } else {
    // find all of the user's reviews
    console.log("User IS NOT an admin");
    let reviews = await Review.find({ user: user.id }).catch(err =>
      console.log(err)
    );

    return res.json(reviews);
  }
}

// GET to "/events/:id/reviews"
// Display form for the user to leave a review for an event.
async function newReview(req, res) {
  let event = await Event.findById(req.params.id);
  let accessToken = req.cookies.tokens.access_token;

  let user = await User.findOne({ access_token: accessToken }).catch(err =>
    console.error(
      `COULD NOT FIND USER WITH access_token: ${accessToken}\n`,
      err.message
    )
  );

  let user_id = user._id;
  console.log(user_id);

  res.render("reviews/new_review", { event, user_id });
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

module.exports = {
  newReview,
  create,
  index,
  eventReviews,
  update
};
