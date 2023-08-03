const express = require("express");
const { isLogin, isAdmin } = require("../middleware/authMiddlware");
const { createAccount } = require("../controller/accountController");
const router = express.Router();

router.post("/", isLogin, isAdmin, createAccount);

module.exports = router;
