const express = require("express");
const router = express.Router();

const { isLogin, isAdmin } = require("../middleware/authMiddlware");
const { getAllLoanRequests } = require("../controller/loanController");

router.get("/", isLogin, isAdmin, getAllLoanRequests);

module.exports = router;
