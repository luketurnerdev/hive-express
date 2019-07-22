
users = [
  {
    id:            ObjectId,
    meetup_uid:    Number,
    email:         String,
    name:          String,
    city:          String,
    photo:         String,
    admin:         Boolean,
    confirmed:     Boolean,
    access_token:  String,
    refresh_token: String
  }
]

events = [
  {
    id:                ObjectId,
    link:              String,
    name:              String,
    group: {
      name:            String,
      urlname:         String
    },
    photo_link:        String,
    local_date:        Date,
    local_time:        Date,
    status:            String,
    location: {
      name:            String,
      address:         String,
      city:            String,
      how_to_find_us:  String,
    },
    attendance_count:  Number,
    guest_limit:       Number,
    rsvp_limit:        Number,
    description:       String,
    attendees:         [Number],
    hive_attendees:    [user],
    ca_recommended:    Boolean,
    suggested: {
      is_suggested:    Boolean,
      suggested_by:    Number,
      message:         String
    }
  }
]

reviews = [
  {
    id:       ObjectId,
    user:     user,
    event:    event,
    rating: {
      food:   Number,
      drinks: Number,
      talk:   Number,
      vibe:   Number
    },
    comment:  String
  }
]


