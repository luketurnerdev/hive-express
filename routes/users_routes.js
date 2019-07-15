const express = require("express");
const router = express.Router();
const usersController = require("./../controllers/users_controller");

// User's profile
router.get("/:id", usersController.show);

module.exports = router;