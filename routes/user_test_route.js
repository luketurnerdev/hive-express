//This is a test file for creating new users

const express = require("express");
const router = express.Router();
const usersController = require("./../controllers/users_controller");
const { celebrate, Joi } = require("celebrate");

// all paths are preceeded by "/"
// router.get("/", usersController.index);

//Create a user
// router.post("/routes/user_test_route", celebrate({
//     body: {
//         meetup_uid: Joi.number().required,
//         email: Joi.string().required(),
//         password: Joi.string().required(),
//         firstName: Joi.string().required(),
//         lastName: Joi.string().required(),
//         city: Joi.string().required(),
//         avatar: Joi.string().required(),
//         admin: Joi.boolean().required(),
//         confirmed: Joi.boolean().required(),
//         access_token: Joi.string().required(),
//         refresh_token: Joi.string().required(),
//         created_at: {
//             type: Date,
//             default: Date.now
//         },
//         updated_at: {
//             type: Date,
//             default: Date.now
//         }

    // }
// }), usersController.create);

//User creation flow:

//1. There will be a login / signup page
//2. User authenticates on meetup
//3. Once confirmed, they will be sent back to the callback route, at which point the tokens will be retrieved
//4. At this point, the user table will be queried. If the user exists, sign them in and redirect to dashboard. Run update tokens in the user table
//5. If not, make a new user with the tokens and other information from meetup.

module.exports = router;
