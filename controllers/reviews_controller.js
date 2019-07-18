//This controller handles the methods for creating, reading, updating and destroying user reviews on events

//Import the user model
const User = require("./../database/models/user_model");

//Events model
const Events = require("./../database/models/event_model");

const Review = require("./../database/models/reviews_model")

async function index(req, res) {
    console.log('index');
    res.send("all reviews go here");
}

async function newReview(req, res) {
    let event =  await Events.findById(req.params.id)
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

async function create(req, res) {
    console.log(req.body);
    // let user = req.body.user_id;
    let user = req.body.user;

    let event = req.body.event_id;
    let comment = req.body.message;
    let ratings = {
        food: 5,
        drinks: 3,
        talks: 1,
        vibe: 4
    }


    // //Create db entry
    let review = await Review.create({
        user,
        event,
        comment,
        ratings
    })
    .then(response => {
        console.log(response);
    })
    .catch(err =>{
        console.log(err);
    })

    res.redirect("/events");

}

module.exports = {
    newReview,
    create,
    index
}
