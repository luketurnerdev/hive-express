//This controller handles the methods for creating, reading, updating and destroying user reviews on events

//Import the user model
const User = require("./../database/models/user_model");

//Events model
const Events = require("./../database/models/event_model");

async function newReview(req, res) {
    let event =  await Events.findById(req.params.id)
    .catch(err => {
        res.status(404).send(err)
    
        
    });

    res.render("reviews/new_review", {event})
    
}

module.exports = {
    newReview
}
