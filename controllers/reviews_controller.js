//This controller handles the methods for creating, reading, updating and destroying user reviews on events

//Import the user model
const User = require("./../database/models/user_model");

async function newReview(req, res) {
    res.send("ok");
}

module.exports = {
    newReview
}