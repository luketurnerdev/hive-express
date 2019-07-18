//This controller handles the methods for creating, reading, updating and destroying user reviews on events

//User model
const User = require("./../database/models/user_model");
//Event model
const Event = require("./../database/models/event_model");
//Review Model
const Review = require("./../database/models/review_model")

// GET to "/reviews"
// Show all reviews to admin
async function index(req, res) {
    // if "tokens" cookie isn't found
    if (!req.cookies.tokens) {
        // redirect to homepage
        return res.redirect("/")
    }

    // find user with accessToken
    let accessToken = req.cookies.tokens.access_token;
    let user = await User
        .find({ access_token: accessToken })
        .catch(err => console.log(err));
    
    let reviews;
    // if user is not an admin
    if (user.admin === false) {
        // get all of the user's reviews
        reviews = await Review
            .find({ "user": user._id })
            .catch(err => console.log(err));
    } else {
        // otherwise get all reviews
        reviews = await Review
            .find()
            .sort({ created_at: "desc" })
            .catch(err => console.log(err));
    }
    
    // send reviews to view
    return res.send(reviews)
}

// GET to "/events/:id/reviews"
// Display form for the user to leave a review for an event.
async function newReview(req, res) {
    let event =  await Event.findById(req.params.id)
    let accessToken = req.cookies.tokens.access_token;

    let user = await User
    .findOne({access_token: accessToken})
    .catch(err => console.error(
      `COULD NOT FIND USER WITH access_token: ${accessToken}\n`,
      err.message
    ));

    let user_id = user._id;
    console.log(user_id);

    res.render("reviews/new_review", {event, user_id} )
    
}

// POST to "/reviews"
// Create a review in the database when the user submits form.
async function create(req, res) {
    // destructure values from req.body
    let {
        user_id: user,   // rename user_id to user
        event_id: event, // rename event_id to event
        message: comment // rename message to comment
    } = req.body;

    // dummy data for rating
    let rating = {
        food: 5,
        drinks: 3,
        talks: 1,
        vibe: 4
    }

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
function eventReviews(req, res) {}

module.exports = {
    newReview,
    create,
    index
}
