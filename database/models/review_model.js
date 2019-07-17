const mongoose = require("mongoose");
const reviewSchema = require("./../schemas/rating_schema");

const reviewModel = mongoose.model("rating", reviewSchema);

module.exports = reviewModel;
