const { Schema } = require("mongoose");

const reviewSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true
    },
    event: {
      type: Schema.Types.ObjectId,
      ref: "event",
      required: true
    },
    rating: {
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
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
  }
);

module.exports = reviewSchema;
