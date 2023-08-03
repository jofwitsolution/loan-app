const express = require("express");
const router = express.Router();

const { getProfile, getUsers } = require("../controller/userController");
const { isLogin, isAdmin } = require("../middleware/authMiddlware");

router.get("/:id/profile", isLogin, getProfile);
router.get("/", isLogin, isAdmin, getUsers);

module.exports = router;
