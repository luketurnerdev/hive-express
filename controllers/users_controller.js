//Import the user model
const User = require("./../database/models/user_model");

function index(req, res) {
    res.send("Users index");
  }

function create() {
    //Create a new user when they sign up
    //Most of this information will be pulled from the Meetup API

    //We may need to insert checks to determine if the user already exists in the DB or not.
}

async function create(req, res) {
    let {
      meetup_uid,
      email,
      password,
      firstName,
      lastName,
      city,
      avatar,
      admin,
      confirmed,
      access_token,
      refresh_token,
      created_at,
      updated_at
    } = req.body;

    let user = await User.create({
      meetup_uid,
      email,
      password,
      firstName,
      lastName,
      city,
      avatar,
      admin,
      confirmed,
      access_token,
      refresh_token,
      created_at,
      updated_at
      }).catch(err =>
        res.status(500).send(err)
      );

      console.log(user);
      
      res.send(req.body);

}

// async function create(req, res) {
    // const { meetup_uid, email, password, firstName, lastName, city, avatar, admin, confirmed, access_token, refresh_token, created_at, updated_at } = req.body;
    // req.user.bookmarks.push({ title, url });
    // await req.user.save();
    // res.json(req.body);
// }

module.exports = {
    index,
    create
}