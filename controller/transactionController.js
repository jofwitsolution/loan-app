const { Transaction } = require("../models/Transaction");

const accountId = process.env.ACCOUNT_ID;

// @Method: GET /transactions
// @Desc: Get all transactions
// @Access: private/admin
const getAllTransactions = async (req, res, next) => {
  try {
    const transactions = await Transaction.find({}).populate({
      path: "user",
      select: "firstName lastName email",
    });

    res.json({ transactions });
  } catch (error) {
    next(error);
  }
};

// @Method: GET /transactions/:id
// @Desc: Get transaction
// @Access: private
const getTransaction = async (req, res, next) => {
  try {
    const transactions = await Transaction.findOne({
      _id: req.params.id,
    }).populate({
      path: "user",
      select: "-password",
    });

    res.json({ transactions });
  } catch (error) {
    next(error);
  }
};

// @Method: GET /transactions/overview/all
// @Desc: Get transaction
// @Access: private
const getTransactionOverview = async (req, res, next) => {
  try {
    const transactions = await Transaction.find({});

    let totalPayIn = 0,
      totalPayOut = 0;

    transactions.forEach((transaction) => {
      if (transaction.adminType === "pay-in") totalPayIn += transaction.amount;
      if (transaction.adminType === "pay-out")
        totalPayOut += transaction.amount;
    });

    res.json({ totalPayIn, totalPayOut, amountDue: totalPayOut - totalPayIn });
  } catch (error) {
    next(error);
  }
};

module.exports.getAllTransactions = getAllTransactions;
module.exports.getTransaction = getTransaction;
module.exports.getTransactionOverview = getTransactionOverview;
