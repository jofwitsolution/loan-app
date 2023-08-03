const express = require("express");
const { isLogin, isAdmin } = require("../middleware/authMiddlware");
const {
  createAccount,
  fundAccount,
  updateAccount,
  getAccount,
} = require("../controller/accountController");
const router = express.Router();

router.post("/", isLogin, isAdmin, createAccount);
router.post("/:id/fund", isLogin, isAdmin, fundAccount);
router
  .route("/:id")
  .put(isLogin, isAdmin, updateAccount)
  .get(isLogin, isAdmin, getAccount);

module.exports = router;
