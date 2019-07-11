const mongoose = require("mongoose");
const ratingSchema = require("./../schemas/rating_schema");

const ratingModel = mongoose.model("rating", ratingSchema);

module.exports = ratingModel;
