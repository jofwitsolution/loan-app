const express = require("express");
const router = express.Router();

const { isLogin, isAdmin } = require("../middleware/authMiddlware");
const {
  getAllLoanRequests,
  loanAction,
  loanRefund,
} = require("../controller/loanController");

router.get("/", isLogin, isAdmin, getAllLoanRequests);
router.post("/:loanId/action", isLogin, isAdmin, loanAction);
router.post("/:loanId/refund", isLogin, loanRefund);

module.exports = router;
