const express = require("express");
const router = express.Router();
const usersController = require("./../controllers/users_controller");
const authController = require("./../controllers/auth_controller");

// Register page
router.get("/register", authController.index);

// POST to "/register"
// Create a user
router.post("/register", usersController.create);

//If the user already exists in the db,
// run the below code to update their tokens

//PUT / PATCH METHODS 

// router.put("/register", userController.update);
// router.patch("/register", userController.update);

module.exports = router;