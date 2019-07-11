const { Schema } = require("mongoose");

const ratingSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    required: true
  },
  event: {
    type: Schema.Types.ObjectId,
    required: true
  },
  score: {
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

module.exports = ratingSchema;
