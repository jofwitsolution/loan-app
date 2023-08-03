const { validateAccount } = require("../lib/validation/accountValidation");
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

    res.json({ success: true, msg: "Account created successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports.createAccount = createAccount;
