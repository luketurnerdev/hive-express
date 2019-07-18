const mongoose = require("mongoose");
const reviewsSchema = require("./../schemas/reviews_schema");

const reviewsModel = mongoose.model("reviews", reviewsSchema);

module.exports = reviewsModel;
