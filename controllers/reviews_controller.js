//This controller handles the methods for creating, reading, updating and destroying user reviews on events

//Import the user model
const User = require("./../database/models/user_model");

//Event model
const Event = require("./../database/models/event_model");

//Review Model
const Review = require("./../database/models/review_model")

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
        .catch(err => res.status(404).send(err));
    
    let reviews;
    // if user is not an admin
    if (!user.admin) {
        // get all of the user's reviews
        reviews = await Review
            .find({ "user": user.id })
            .catch(err => res.status(404).send(err));
    } else {
        // otherwise get all reviews
        reviews = await Review
            .find()
            .sort({ created_at: "desc" })
            .catch(err => res.status(404).send(err));
    }
    
    // send reviews to view
    console.log(reviews)
    return res.send(reviews)
}

async function newReview(req, res) {
    let event =  await Event.findById(req.params.id)
    let accessToken = req.cookies.tokens.access_token;
    let user = await User.find({
        access_token: accessToken
    })
    .catch(err => {
        res.status(404).send(err)
    });


    res.render("reviews/new_review", {event, user} )
    
}

async function create(req, res) {
    let user = req.body.user;
    console.log(user.id);
    res.send('ok');
    // res.redirect("/events");

    //Create db entry
}

module.exports = {
    newReview,
    create,
    index
}
