const express = require("express");
const router = express.Router();

const {
  signup,
  login,
  forgotPassword,
  resetPassword,
  logout,
} = require("../controller/authController");
const { isLogin } = require("../middleware/authMiddlware");

router.post("/signup", signup);
router.post("/login", login);
router.delete("/logout", isLogin, logout);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

module.exports = router;
