const express = require("express");
const router = express.Router();

const { isLogin, isAdmin } = require("../middleware/authMiddlware");
const {
  getAllTransactions,
  getTransaction,
  getTransactionOverview,
} = require("../controller/transactionController");

router.get("/", isLogin, isAdmin, getAllTransactions);
router.get("/:id", isLogin, getTransaction);
router.get("/overview/all", isLogin, isAdmin, getTransactionOverview);

module.exports = router;
