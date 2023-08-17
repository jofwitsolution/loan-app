const { User } = require("../models/User");
const { Account } = require("../models/Account");
const { LoanRequest } = require("../models/LoanRequest");
const { Transaction } = require("../models/Transaction");
const { validateLoanRequest } = require("../lib/validation/loanValidation");
const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require("../lib/error");

const accountId = process.env.ACCOUNT_ID;

// @Method: GET /users
// @Desc: Get all users
// @Access: private/admin
const getUsers = async (req, res, next) => {
  const users = await User.find({}).select("-password -isAuthorizedAdmin");

  res.json({ success: true, users });
};

// @Method: GET /users/:id/profile
// @Desc: User profile
// @Access: private
const getProfile = async (req, res, next) => {
  const user = await User.findById(req.params.id).select(
    "-password -isAuthorizedAdmin"
  );
  if (!user) {
    throw new NotFoundError("User not found");
  }

  res.json({ success: true, user });
};

// @Method: POST /users/:userId/request-loan
// @Desc: Make loan request
// @Access: private
const requestLoan = async (req, res, next) => {
  // validate body of request (amount)
  const error = await validateLoanRequest(req.body);
  if (error) {
    throw new BadRequestError(error);
  }

  if (req.params.userId !== req.user._id.toString()) {
    throw new UnauthorizedError("You are not authorized");
  }

  const user = await User.findById(req.params.userId);
  if (!user) {
    throw new NotFoundError("User not found");
  }

  // check if amount is not less than or greater than min/max request
  const account = await Account.findById(accountId);
  if (!account) {
    throw new NotFoundError("No account found");
  }

  const { amount } = req.body;

  if (amount < account.minLoan || amount > account.maxLoan) {
    throw new BadRequestError(
      `Minimum request is ${account.minLoan} and maximum request is ${account.maxLoan}.`
    );
  }

  if (user.hasLoanRequest) {
    throw new UnauthorizedError("You already have a loan request");
  }

  const loan = new LoanRequest({
    user: user._id,
    amount,
  });

  await loan.save();

  user.hasLoanRequest = true;
  await user.save();

  res.status(201).json({ success: true, loanRequest: loan });
};

// @Method: GET /users/:userId/loan-requests
// @Desc: Get user requests
// @Access: private
const getUserLoanRequests = async (req, res, next) => {
  const loanRequests = await LoanRequest.find({ user: req.params.userId });

  res.json({ loanRequests });
};

// @Method: GET /users/:userId/transactions
// @Desc: Get user transactions
// @Access: private
const getUserTransactions = async (req, res, next) => {
  const transactions = await Transaction.find({ user: req.params.userId });

  res.json({ transactions });
};

module.exports.getProfile = getProfile;
module.exports.getUsers = getUsers;
module.exports.requestLoan = requestLoan;
module.exports.getUserLoanRequests = getUserLoanRequests;
module.exports.getUserTransactions = getUserTransactions;
