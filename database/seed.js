const User = require("./models/user_model");

async function createAdmin() {
  let jim = {
    meetup_uid: 263998824,
    admin: true,
    confirmed: true,
    email: "the.jim.farrugia@gmail.com",
    name: "Jim Farrugia",
    city: "Sydney",
    photo:
      "https://secure.meetupstatic.com/photos/member/4/d/e/3/member_280939939.jpeg"
    //access_token?
    //refresh_token?
  };
  await User.create(jim)
    .then(resp => console.log("SEED CREATED:", resp))
    .catch(err => console.log(err));
}
