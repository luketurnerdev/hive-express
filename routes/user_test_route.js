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

module.exports = router;
