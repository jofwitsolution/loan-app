const { User } = require("../models/User");
const { Account } = require("../models/Account");
const { LoanRequest } = require("../models/LoanRequest");
const {
  validateLoanAction,
  validateLoanRefund,
} = require("../lib/validation/loanValidation");
const { Transaction } = require("../models/Transaction");
const { BadRequestError, NotFoundError } = require("../lib/error");

const accountId = process.env.ACCOUNT_ID;

// @Method: GET /loans?status=status&count=count
// @Desc: Get all loan requests
// @Access: private/admin
const getAllLoanRequests = async (req, res, next) => {
  let count = req.query.count;
  const loanStatus = req.query.status;
  const mongoQuery = loanStatus ? { status: loanStatus } : {};

  let loanRequests = [];
  if (count !== undefined) {
    count = parseInt(count);
    loanRequests = await LoanRequest.find(mongoQuery)
      .populate({
        path: "user",
        select: "firstName lastName accountBalance email",
      })
      .limit(count);
  } else {
    loanRequests = await LoanRequest.find(mongoQuery).populate({
      path: "user",
      select: "firstName lastName accountBalance email",
    });
  }

  res.json({ loanRequests });
};

// @Method: POST /loans/:loanId/action
// @Desc: Admin accept or decline loan
// @Access: private/admin
const loanAction = async (req, res, next) => {
  const error = await validateLoanAction(req.body);
  if (error) {
    throw new BadRequestError(error);
  }

  const { action, comment } = req.body;

  const loanRequest = await LoanRequest.findOne({ _id: req.params.loanId });
  if (!loanRequest) {
    throw new NotFoundError("Loan request not found.");
  }

  // Only loans with a status of pending can be accepted or declined.
  if (loanRequest.status !== "pending") {
    throw new BadRequestError("Only pending loans are expected.");
  }

  const user = await User.findOne({ _id: loanRequest.user });
  if (!user) {
    throw new NotFoundError("User not found");
  }

  if (action === "declined") {
    loanRequest.status = "declined";
    loanRequest.actionDate = new Date();
    loanRequest.comment = comment;
    user.hasLoanRequest = false;

    await user.save();
    await loanRequest.save();

    res.json({ msg: "Declined" });
    return;
  }

  const account = await Account.findOne({ _id: accountId });
  if (!account) {
    throw new NotFoundError("No account found");
  }

  if (account.accountBalance <= loanRequest.amount) {
    throw new BadRequestError("Not enough balance");
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
  loanRequest.isActive = true;
  loanRequest.actionDate = new Date();
  loanRequest.dueDate = new Date(Date.now() + 864_000_000); // current date + 10 days (864000000ms)

  await loanRequest.save();

  res.json({ msg: "Loan successfully granted." });
};

// @Method: POST /loans/:loanId/refund
// @Desc: User loan refund
// @Access: private
const loanRefund = async (req, res, next) => {
  const error = await validateLoanRefund(req.body);
  if (error) {
    throw new BadRequestError(error);
  }

  const loanRequest = await LoanRequest.findOne({ _id: req.params.loanId });
  if (!loanRequest) {
    throw new NotFoundError("The loan you want to return not found.");
  }

  if (Number(req.body.amount) < loanRequest.amount) {
    throw new BadRequestError(
      `You can't refund less than ${loanRequest.amount}.`
    );
  }

  const user = await User.findOne({ _id: req.user._id });
  if (!user) {
    throw new NotFoundError("User not found.");
  }

  if (!user.hasLoanRequest && !loanRequest.isActive) {
    throw new BadRequestError("This loan has been paid");
  }

  const account = await Account.findOne({ _id: accountId });
  if (!account) {
    throw new NotFoundError("Account not found.");
  }

  account.accountBalance += Number(req.body.amount);
  await account.save();

  user.hasLoanRequest = false;
  await user.save();

  loanRequest.isActive = false;
  loanRequest.returnDate = new Date();
  await loanRequest.save();

  const transaction = new Transaction({
    user: user._id,
    amount: loanRequest.amount,
    adminType: "pay-in",
    userType: "pay-out",
  });

  await transaction.save();

  res.json({ msg: "Loan refund successful.", success: true });
};

module.exports.getAllLoanRequests = getAllLoanRequests;
module.exports.loanAction = loanAction;
module.exports.loanRefund = loanRefund;
