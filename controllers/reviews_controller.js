//This controller handles the methods for creating, reading, updating and destroying user reviews on events

//Import the user model
const User = require("./../database/models/user_model");

//Events model
const Events = require("./../database/models/event_model");

// const Reviews = require("./../database/models/rating_model")

async function index(req, res) {
    console.log('index');
    res.send("all reviews go here");
}

async function newReview(req, res) {
    let event =  await Events.findById(req.params.id)
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
