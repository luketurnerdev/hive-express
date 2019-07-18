const { Schema } = require("mongoose");

const reviewsSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    required: true
  },
  event: {
    type: Schema.Types.ObjectId,
    required: true
  },
  ratings: {
    food: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    drinks: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    talks: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    vibe: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    }
  },
  comment: {
    type: String,
    required: true,
    trim: true
  }
});

module.exports = reviewsSchema;
