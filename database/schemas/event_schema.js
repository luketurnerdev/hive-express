const { Schema } = require("mongoose");

const eventSchema = new Schema({
  link: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  group: {
    type: String,
    required: true
  },
  local_date: {
    type: Date,
    required: true
  },
  local_time: {
    type: Date,
    required: true
  },
  how_to_find_us: {
    type: String,
    required: true,
    trim: true
  },
  attendance_count: {
    type: Number,
    required: true
  },
  guest_limit: {
    type: Number,
    required: true
  },
  rsvp_limit: {
    type: Number,
    required: true
  },
  attendees: [Number],
  hive_attendees: [Number],
  ca_recommended: {
    type: Boolean,
    required: true,
    default: false
  },
  student_suggested: {
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

module.exports = eventSchema;
