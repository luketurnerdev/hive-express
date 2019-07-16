const { Schema } = require("mongoose");

const eventSchema = new Schema({
  meetup_id: {
    type: String,
    required: true
  },
  link: {
    type: String,
    required: true
  },
  photo_link: {
    type: String
    //required: true
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
    type: String,
    required: true
  },
  local_time: {
    type: String,
    required: true
  },
  status: {
    type: String
    //required: true
  },
  location: {
    name: {
      type: String,
      required: true
    },
    address: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    how_to_find_us: {
      type: String,
      required: true,
      trim: true
    }
  },
  attendance_count: {
    type: Number
    //required: true
  },
  guest_limit: {
    type: Number
    //required: true
  },
  rsvp_limit: {
    type: Number
    //required: true
  },
  description: {
    type: String,
    required: true
  },
  attendees: [Number],
  hive_attendees: [Number],
  ca_recommended: {
    type: Boolean,
    required: true,
    default: false
  },
  suggested: {
    is_suggested: {
      type: Boolean,
      required: true,
      default: false
    },
    suggested_by: Schema.Types.ObjectId,
    message: String,
  }
},
{
  timestamps: {createdAt: 'created_at', updatedAt: 'updated_at'}
}
);

module.exports = eventSchema;
