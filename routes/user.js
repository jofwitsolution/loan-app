const express = require("express");
const router = express.Router();

const {
  getProfile,
  getUsers,
  requestLoan,
  getUserLoanRequests,
  getUserTransactions,
  getCurrentUser,
} = require("../controller/userController");
const { isLogin, isAdmin } = require("../middleware/authMiddlware");

router.get("/:id/profile", isLogin, getProfile);
router.get("/current-user", isLogin, getCurrentUser);
router.get("/", isLogin, isAdmin, getUsers);
router.post("/:userId/request-loan", isLogin, requestLoan);
router.get("/:userId/loan-requests", isLogin, getUserLoanRequests);
router.get("/:userId/transactions", isLogin, getUserTransactions);

module.exports = router;
