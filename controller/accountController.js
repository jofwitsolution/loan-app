const {
  validateAccount,
  validateFund,
  validateAccountUpdate,
} = require("../lib/validation/accountValidation");
const { Account } = require("../models/Account");
const { BadRequestError, NotFoundError } = require("../lib/error");

// @Method: Post /account
// @Desc: Create account
// @Access: private/admin
const createAccount = async (req, res, next) => {
  // validate
  const error = await validateAccount(req.body);
  if (error) {
    throw new BadRequestError(error);
  }

  const { name, accountBalance, minLoan, maxLoan } = req.body;

  const account = new Account({
    name,
    accountBalance,
    minLoan,
    maxLoan,
  });

  await account.save();

  res.status(201).json({ success: true, msg: "Account created successfully" });
};

// @Method: GET /account/:id
// @Desc: Get account
// @Access: private/admin
const getAccount = async (req, res, next) => {
  const account = await Account.findById(req.params.id);
  if (!account) {
    throw new NotFoundError("Account doesn't exist.");
  }

  res.json({ success: true, account });
};

// @Method: Post /account/:id/fund
// @Desc: Fund account
// @Access: private/admin
const fundAccount = async (req, res, next) => {
  // validate
  const error = await validateFund(req.body);
  if (error) {
    throw new BadRequestError(error);
  }

  const { amount } = req.body;

  const account = await Account.findById(req.params.id);
  if (!account) {
    throw new NotFoundError("Account doesn't exist.");
  }

  account.accountBalance = account.accountBalance + Number(amount);

  await account.save();

  res.json({ success: true, msg: "Account funded successfully", account });
};

// @Method: Put /account/:id
// @Desc: Update account
// @Access: private/admin
const updateAccount = async (req, res, next) => {
  // validate
  const error = await validateAccountUpdate(req.body);
  if (error) {
    throw new BadRequestError(error);
  }

  const { name, minLoan, maxLoan } = req.body;

  const account = await Account.findById(req.params.id);
  if (!account) {
    throw new NotFoundError("Account doesn't exist.");
  }

  account.name = name;
  account.minLoan = minLoan;
  account.maxLoan = maxLoan;

  await account.save();

  res.json({ success: true, msg: "Account updated successfully", account });
};

module.exports.createAccount = createAccount;
module.exports.getAccount = getAccount;
module.exports.fundAccount = fundAccount;
module.exports.updateAccount = updateAccount;
