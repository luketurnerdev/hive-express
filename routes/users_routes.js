const express = require("express");
const router = express.Router();
const usersController = require("./../controllers/users_controller");

// GET to "/users/request"
// User is redirected here after registering if their
//   account is not yet confirmed by an admin.
// Display a form for the user to send a message to the admin.
router.get("/request", usersController.newAccountRequest);

// PUT to "/users/request"
// Update the user's DB document to include their message
router.put("/request", usersController.createAccountRequest);

//Delete user
router.delete("/:id/delete", usersController.deleteUser);

// User's profile
router.get("/:id", usersController.show);

module.exports = router;
