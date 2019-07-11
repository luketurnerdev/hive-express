const { Schema } = require("mongoose");

const userSchema = new Schema({
  meetup_uid: {
    type: Number,
    required: true
  },
  email: {
    type: String,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    trim: true
  },
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  nickname: {
    type: String,
    trim: true
  },
  city: {
    type: String,
    required: true
  },
  avatar: {
    type: String
  },
  admin: {
    type: Boolean,
    required: true,
    default: false
  },
  confirmed: {
    type: Boolean,
    required: true,
    default: false
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
});

module.exports = userSchema;
