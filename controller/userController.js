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
const { StatusCodes } = require("http-status-codes");
const {
  validateUserWithdrawal,
} = require("../lib/validation/withdrawalValidation");

const accountId = process.env.ACCOUNT_ID;

// @Method: GET /users
// @Desc: Get all users
// @Access: private/admin
const getUsers = async (req, res, next) => {
  const users = await User.find({}).select("-password -isAuthorizedAdmin");

  res.json({ success: true, users });
};

// @Method: GET /users/current-user
// @Desc: Get current user
// @Access: private
const getCurrentUser = async (req, res, next) => {
  const user = await User.findById(req.user._id).select(
    "-password -isAuthorizedAdmin"
  );
  if (!user) {
    throw new NotFoundError("User not found");
  }

  res.json({ success: true, user });
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

// @Method: POST /users/request-loan
// @Desc: Make loan request
// @Access: private
const requestLoan = async (req, res, next) => {
  // validate body of request (amount)
  const error = await validateLoanRequest(req.body);
  if (error) {
    throw new BadRequestError(error);
  }

  const user = await User.findById(req.user._id);
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

// @Method: GET /users/:userId/loan-requests?status=status&count=count
// @Desc: Get user requests
// @Access: private
const getUserLoanRequests = async (req, res, next) => {
  const mongoQuery = {
    user: req.params.userId,
  };
  let count = req.query.count;

  const loanStatus = req.query.status;
  if (loanStatus && loanStatus === "pending") {
    mongoQuery.status = req.query.status;

    const pendingLoan = await LoanRequest.findOne(mongoQuery);
    res.json({ pendingLoan });
    return;
  }
  if (loanStatus) {
    mongoQuery.status = loanStatus;
  }

  let loanRequests = [];
  if (count !== undefined) {
    loanRequests = await LoanRequest.find(mongoQuery)
      .limit(count)
      .sort({ requestDate: -1 });
  } else {
    loanRequests = await LoanRequest.find(mongoQuery).sort({ requestDate: -1 });
  }

  res.json({ loanRequests });
};

// @Method: GET /users/user-overview
// @Desc: Get user overview
// @Access: private
const getUserOverview = async (req, res) => {
  const user = await User.findOne({ _id: req.user._id });
  if (!user) {
    throw new NotFoundError("User not found");
  }

  const totalLoans = (await LoanRequest.find({ user: user._id })).length;
  const activeLoan = await LoanRequest.findOne({
    user: user._id,
    status: "accepted",
    isActive: true,
  });
  const declinedLoans = (
    await LoanRequest.find({
      user: user._id,
      status: "declined",
    })
  ).length;

  const overview = {
    balance: user.accountBalance,
    activeLoanAmount: activeLoan?.amount || 0,
    totalLoans,
    declinedLoans,
  };

  res.json({ overview });
};

// @Method: GET /users/:userId/transactions
// @Desc: Get user transactions
// @Access: private
const getUserTransactions = async (req, res, next) => {
  const transactions = await Transaction.find({ user: req.params.userId });

  res.json({ transactions });
};

// @Method: POST /users/withdraw
// @Desc: User withdraw fund
// @Access: private
const userWithdrawFund = async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    throw new NotFoundError("User not found");
  }

  const error = await validateUserWithdrawal(req.body);
  if (error) {
    throw new BadRequestError(error);
  }

  const { withdrawalType, bank, accountNumber, amount } = req.body;
  const withdrawalAmount = parseInt(amount);
  if (withdrawalAmount > user.accountBalance) {
    throw new BadRequestError("Not enough balance");
  }

  user.accountBalance = user.accountBalance - withdrawalAmount;
  await user.save();

  const transaction = new Transaction({
    user: user._id,
    amount: withdrawalAmount,
    status: "successful",
    adminType: "none",
    userType: "withdrawal",
  });

  await transaction.save();

  res.json({ success: true, withdrawalAmount, msg: "Withdrawal successful" });
};

module.exports.getProfile = getProfile;
module.exports.getCurrentUser = getCurrentUser;
module.exports.getUsers = getUsers;
module.exports.requestLoan = requestLoan;
module.exports.getUserLoanRequests = getUserLoanRequests;
module.exports.getUserTransactions = getUserTransactions;
module.exports.getUserOverview = getUserOverview;
module.exports.userWithdrawFund = userWithdrawFund;
