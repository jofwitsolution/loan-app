const express = require("express");
const router = express.Router();

const {
  getProfile,
  getUsers,
  requestLoan,
  getUserLoanRequests,
  getUserTransactions,
  getCurrentUser,
  getUserOverview,
  userWithdrawFund,
} = require("../controller/userController");
const { isLogin, isAdmin } = require("../middleware/authMiddlware");

router.get("/:id/profile", isLogin, getProfile);
router.get("/current-user", isLogin, getCurrentUser);
router.get("/user-overview", isLogin, getUserOverview);
router.get("/", isLogin, isAdmin, getUsers);
router.post("/:userId/request-loan", isLogin, requestLoan);
router.get("/:userId/loan-requests", isLogin, getUserLoanRequests);
router.get("/:userId/transactions", isLogin, getUserTransactions);
router.post("/withdraw", isLogin, userWithdrawFund);

module.exports = router;
