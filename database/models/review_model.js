const mongoose = require("mongoose");
const reviewSchema = require("./../schemas/review_schema");

const reviewModel = mongoose.model("review", reviewSchema);

module.exports = reviewModel;
