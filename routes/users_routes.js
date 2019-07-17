const express = require("express");
const router = express.Router();
const usersController = require("./../controllers/users_controller");

// User's profile
router.get("/:id", usersController.show);

//Modify user confirmed status

router.put("/:id", usersController.confirmUser);

//Delete user
router.delete("/:id/delete", usersController.deleteUser);

module.exports = router;