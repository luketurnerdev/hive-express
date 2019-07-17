const { Schema } = require("mongoose");
const date = new Date();

//These are the attributes a user will have
//A lot of these will be pulled from the user's Meetup.com profile
const userSchema = new Schema(
  {
    meetup_uid: {
      type: Number,
      required: true
    },
    email: {
      type: String,
      required: true,
      trim: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    city: {
      type: String,
      required: true
    },
    photo: {
      type: String
    },
    admin: {
      type: Boolean,
      required: true,
      default: false
    },
    request_message: {
      type: String
    },
    confirmed: {
      type: Boolean,
      required: true,
      default: false
    },
    access_token: String,
    refresh_token: String
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
  }
);

module.exports = userSchema;
