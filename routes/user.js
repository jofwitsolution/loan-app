const express = require("express");
const router = express.Router();

const {
  getProfile,
  getUsers,
  requestLoan,
  getUserLoanRequests,
} = require("../controller/userController");
const { isLogin, isAdmin } = require("../middleware/authMiddlware");

router.get("/:id/profile", isLogin, getProfile);
router.get("/", isLogin, isAdmin, getUsers);
router.post("/:userId/request-loan/:accountId", isLogin, requestLoan);
router.get("/:userId/loan-requests", isLogin, getUserLoanRequests);

module.exports = router;
