//Import the user model
const User = require("./../database/models/user_model");
const meetupService = require("./../services/meetupService");
const axios = require("axios");

function index(req, res) {
    res.send("Users index");
  }

//Import access and refresh tokens from authorization
//Do get request here for user info, store it in a variable and then write it to the DB

const userData = {

}


//1. Do we need password when we are using OAuth? We cannot extract this from meetup anyway
//2. Meetup just has 'name', not first and last name

async function create(req, res) {
    let {
      meetup_uid,
      email,
      name,
      city,
      photo,
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
      name,
      city,
      photo,
      admin,
      confirmed,
      access_token,
      refresh_token,
      created_at,
      updated_at
      })
      
      .catch(err =>
        res.status(500).send(err)
      );
      
      res.send(req.body);

}

async function update(id, newValues) {

console.log('new token: ' + newValues.access_token);
  await User.update(
    { meetup_uid: id },
    { $set:
       {
         'access_token' : newValues.access_token,
         'refresh_token' : newValues.refresh_token

       }
    }
 ).then(item => {
   console.log(item);


 }).catch(err => {
   console.log(err);
 })


}

module.exports = {
    index,
    create,
    update
}