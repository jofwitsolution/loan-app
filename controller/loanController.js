const { User } = require("../models/User");
const { Account } = require("../models/Account");
const { LoanRequest } = require("../models/LoanRequest");
const {
  validateLoanAction,
  validateLoanRefund,
} = require("../lib/validation/loanValidation");
const { Transaction } = require("../models/Transaction");

const accountId = process.env.ACCOUNT_ID;

// @Method: GET /loans
// @Desc: Get all loan requests
// @Access: private/admin
const getAllLoanRequests = async (req, res, next) => {
  try {
    const loanRequests = await LoanRequest.find({}).populate({
      path: "user",
      select: "firstName lastName accountBalance email",
    });

    res.json({ loanRequests });
  } catch (error) {
    next(error);
  }
};

// @Method: POST /loans/:loanId/action
// @Desc: Admin accept or decline loan
// @Access: private/admin
const loanAction = async (req, res, next) => {
  try {
    const error = await validateLoanAction(req.body);
    if (error) {
      res.status(400).json({ success: false, msg: error });
      return;
    }

    const { action, comment } = req.body;

    const loanRequest = await LoanRequest.findOne({ _id: req.params.loanId });
    if (!loanRequest) {
      res.status(404).json({ success: false, msg: "Loan request not found." });
      return;
    }

    if (loanRequest.status !== "pending") {
      res.status(403).json({ msg: "This loan is not valid." });
      return;
    }

    const user = await User.findOne({ _id: loanRequest.user });
    if (!user) {
      res.status(404).json({ success: false, msg: "No user found." });
      return;
    }

    if (action === "declined") {
      loanRequest.status = "declined";
      loanRequest.comment = comment;
      user.hasLoanRequest = false;

      await user.save();
      await loanRequest.save();

      res.json({ msg: "Declined" });
      return;
    }

    const account = await Account.findOne({ _id: accountId });
    if (!account) {
      res.status(404).json({ success: false, msg: "No account found." });
      return;
    }

    if (account.accountBalance <= loanRequest.amount) {
      res.status(400).json({ success: false, msg: "Not enough balance." });
      return;
    }

    account.accountBalance -= loanRequest.amount;

    await account.save();

    user.accountBalance += loanRequest.amount;

    await user.save();

    const transaction = new Transaction({
      user: user._id,
      amount: loanRequest.amount,
      adminType: "pay-out",
      userType: "pay-in",
    });

    await transaction.save();

    loanRequest.status = "accepted";
    loanRequest.refundDate = new Date(Date.now() + 864_000_000); // current date + 10 days (864000000ms)

    await loanRequest.save();

    res.json({ msg: "Loan successfully granted." });
  } catch (error) {
    next(error);
  }
};

// @Method: POST /loans/:loanId/refund
// @Desc: User loan refund
// @Access: private
const loanRefund = async (req, res, next) => {
  try {
    const error = await validateLoanRefund(req.body);
    if (error) {
      res.status(400).json({ success: false, msg: error });
      return;
    }

    const loanRequest = await LoanRequest.findOne({ _id: req.params.loanId });
    if (!loanRequest) {
      res.status(404).json({
        success: false,
        msg: "The loan you want to return not found.",
      });
      return;
    }

    if (Number(req.body.amount) < loanRequest.amount) {
      res.status(400).json({
        success: false,
        msg: `You can't refund less than ${loanRequest.amount}.`,
      });
      return;
    }

    const user = await User.findOne({ _id: req.user._id });
    if (!user) {
      res.status(404).json({ success: false, msg: "User not found." });
      return;
    }

    if (!user.hasLoanRequest) {
      res.status(403).json({ success: false, msg: "This loan has been paid." });
      return;
    }

    const account = await Account.findOne({ _id: accountId });
    if (!account) {
      res.status(404).json({ success: false, msg: "Account not found." });
      return;
    }

    account.accountBalance += Number(req.body.amount);
    await account.save();

    user.hasLoanRequest = false;
    await user.save();

    const transaction = new Transaction({
      user: user._id,
      amount: loanRequest.amount,
      adminType: "pay-in",
      userType: "pay-out",
    });

    await transaction.save();

    res.json({ msg: "Loan refund successful.", success: true });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports.getAllLoanRequests = getAllLoanRequests;
module.exports.loanAction = loanAction;
module.exports.loanRefund = loanRefund;
