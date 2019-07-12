
users = [
  {
    id:            ObjectId,
    meetup_uid:    Number,
    email:         String,
    firstName:     String,
    lastName:      String,
    city:          String,
    avatar:        String,
    admin:         Boolean,
    confirmed:     Boolean,
    access_token:  String,
    refresh_token: String,
    created_at:    Date,
    updated_at:    Date
  }
]

events = [
  {
    id:                ObjectId,
    link:              String,
    name:              String,
    group:             String,
    img_url:           String,
    local_date:        Date,
    local_time:        Date,
    how_to_find_us:    String,
    attendance_count:  Number,
    guest_limit:       Number,
    rsvp_limit:        Number,
    description:       String,
    attendees:         [Number],
    hive_attendees:    [user],
    ca_recommended:    Boolean,
    student_suggested: Boolean
  }
]

ratings = [
  {
    id:       ObjectId,
    user:     user,
    event:    event,
    score: {
      food:   Number,
      drinks: Number,
      talk:   Number,
      vibe:   Number
    },
    comment:  String
  }
]