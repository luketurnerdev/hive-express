//This controller handles the methods for creating, reading, updating and destroying user reviews on events

//Import the user model
const User = require("./../database/models/user_model");

//Events model
const Events = require("./../database/models/event_model");

async function index(req, res) {
    console.log('index');
    res.send("all reviews go here");
}

async function newReview(req, res) {
    let event =  await Events.findById(req.params.id)
    .catch(err => {
        res.status(404).send(err)
    });
    console.log(event);
    res.render("reviews/new_review", {event})
    
}

async function create(req, res) {
    console.log(req);
    res.send('ok');
    // res.redirect("/events");
}

module.exports = {
    newReview,
    create,
    index
}
