const express = require("express");
const router = express.Router();

const { isLogin, isAdmin } = require("../middleware/authMiddlware");
const {
  getAllSignupCodes,
  createSignupCode,
  deleteSignupCode,
} = require("../controller/codeController");

router.get("/", isLogin, isAdmin, getAllSignupCodes);
router.post("/", isLogin, isAdmin, createSignupCode);
router.delete("/", isLogin, isAdmin, deleteSignupCode);

module.exports = router;
