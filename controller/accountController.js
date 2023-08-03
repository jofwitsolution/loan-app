const {
  validateAccount,
  validateFund,
  validateAccountUpdate,
} = require("../lib/validation/accountValidation");
const { Account } = require("../models/Account");

// @Method: Post /account
// @Desc: Create account
// @Access: private/admin
const createAccount = async (req, res, next) => {
  try {
    // validate
    const error = await validateAccount(req.body);
    if (error) {
      res.status(400).json({ msg: error, success: false });
      return;
    }

    const { name, accountBalance, minLoan, maxLoan } = req.body;

    const account = new Account({
      name,
      accountBalance,
      minLoan,
      maxLoan,
    });

    await account.save();

    res
      .status(201)
      .json({ success: true, msg: "Account created successfully" });
  } catch (error) {
    next(error);
  }
};

// @Method: GET /account/:id
// @Desc: Get account
// @Access: private/admin
const getAccount = async (req, res, next) => {
  try {
    const account = await Account.findById(req.params.id);
    if (!account) {
      res.status(404).json({ msg: "Account doesn't exist.", success: false });
      return;
    }

    res.json({ success: true, account });
  } catch (error) {
    next(error);
  }
};

// @Method: Post /account/:id/fund
// @Desc: Fund account
// @Access: private/admin
const fundAccount = async (req, res, next) => {
  try {
    // validate
    const error = await validateFund(req.body);
    if (error) {
      res.status(400).json({ msg: error, success: false });
      return;
    }

    const { amount } = req.body;

    const account = await Account.findById(req.params.id);
    if (!account) {
      res.status(404).json({ msg: "Account doesn't exist.", success: false });
      return;
    }

    account.accountBalance = account.accountBalance + Number(amount);

    await account.save();

    res.json({ success: true, msg: "Account funded successfully", account });
  } catch (error) {
    next(error);
  }
};

// @Method: Put /account/:id
// @Desc: Update account
// @Access: private/admin
const updateAccount = async (req, res, next) => {
  try {
    // validate
    const error = await validateAccountUpdate(req.body);
    if (error) {
      res.status(400).json({ msg: error, success: false });
      return;
    }

    const { name, minLoan, maxLoan } = req.body;

    const account = await Account.findById(req.params.id);
    if (!account) {
      res.status(404).json({ msg: "Account doesn't exist.", success: false });
      return;
    }

    account.name = name;
    account.minLoan = minLoan;
    account.maxLoan = maxLoan;

    await account.save();

    res.json({ success: true, msg: "Account updated successfully", account });
  } catch (error) {
    next(error);
  }
};

module.exports.createAccount = createAccount;
module.exports.getAccount = getAccount;
module.exports.fundAccount = fundAccount;
module.exports.updateAccount = updateAccount;
