const mongoose = require("mongoose");

const accountSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 5,
    maxlength: 50,
    required: true,
  },
  accountBalance: {
    type: Number,
    min: 100000,
    default: 0,
    required: true,
  },
  minLoan: {
    type: Number,
    min: 0,
    default: 0,
    required: true,
  },
  maxLoan: {
    type: Number,
    min: 0,
    default: 0,
    required: true,
  },
  payout: {
    type: Number,
    min: 0,
    default: 0,
  },
  refund: {
    type: Number,
    min: 0,
    default: 0,
  },
  amountToReturn: {
    type: Number,
    min: 0,
    default: 0,
  },
});

const Account = mongoose.model("Account", accountSchema);

module.exports.Account = Account;
