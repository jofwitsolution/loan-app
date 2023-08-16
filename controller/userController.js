const { User } = require("../models/User");
const { Account } = require("../models/Account");
const { LoanRequest } = require("../models/LoanRequest");
const { validateLoanRequest } = require("../lib/validation/loanValidation");
const { Transaction } = require("../models/Transaction");

const accountId = process.env.ACCOUNT_ID;

// @Method: GET /users
// @Desc: Get all users
// @Access: private/admin
const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({}).select("-password -isAuthorizedAdmin");

    res.json({ success: true, users });
  } catch (error) {
    next(error);
  }
};

// @Method: GET /users/:id/profile
// @Desc: User profile
// @Access: private
const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select(
      "-password -isAuthorizedAdmin"
    );
    if (!user) {
      res.status(404).json({ success: false, msg: "User not found" });
      return;
    }

    res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

// @Method: POST /users/:userId/request-loan
// @Desc: Make loan request
// @Access: private
const requestLoan = async (req, res, next) => {
  try {
    // validate body of request (amount)
    const error = await validateLoanRequest(req.body);
    if (error) {
      res.status(400).json({ msg: error, success: false });
      return;
    }

    if (req.params.userId !== req.user._id.toString()) {
      res.status(403).json({
        msg: `Invalid user.`,
        success: false,
      });
      return;
    }

    const user = await User.findById(req.params.userId);
    if (!user) {
      res.status(404).json({
        msg: `User not found.`,
        success: false,
      });
      return;
    }

    // check if amount is not less than or greater than min/max request
    const account = await Account.findById(accountId);
    if (!account) {
      res.status(404).json({ msg: "No account found", success: false });
      return;
    }

    const { amount } = req.body;

    if (amount < account.minLoan || amount > account.maxLoan) {
      res.status(400).json({
        msg: `Minimum request is ${account.minLoan} and maximum request is ${account.maxLoan}.`,
        success: false,
      });
      return;
    }

    if (user.hasLoanRequest) {
      res
        .status(401)
        .json({ success: false, msg: "You already have a loan request" });
      return;
    }

    const loan = new LoanRequest({
      user: user._id,
      amount,
    });

    await loan.save();

    user.hasLoanRequest = true;
    await user.save();

    res.status(201).json({ success: true, loanRequest: loan });
  } catch (error) {
    next(error);
  }
};

// @Method: GET /users/:userId/loan-requests
// @Desc: Get user requests
// @Access: private
const getUserLoanRequests = async (req, res, next) => {
  try {
    const loanRequests = await LoanRequest.find({ user: req.params.userId });

    res.json({ loanRequests });
  } catch (error) {
    next(error);
  }
};

// @Method: GET /users/:userId/transactions
// @Desc: Get user transactions
// @Access: private
const getUserTransactions = async (req, res, next) => {
  try {
    const transactions = await Transaction.find({ user: req.params.userId });

    res.json({ transactions });
  } catch (error) {
    next(error);
  }
};

module.exports.getProfile = getProfile;
module.exports.getUsers = getUsers;
module.exports.requestLoan = requestLoan;
module.exports.getUserLoanRequests = getUserLoanRequests;
module.exports.getUserTransactions = getUserTransactions;
