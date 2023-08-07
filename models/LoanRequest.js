const mongoose = require("mongoose");

const loanRequestSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  amount: {
    type: Number,
    min: 0,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "declined", "accepted"],
    required: true,
    default: "pending",
  },
  date: {
    type: Date,
    default: Date.now,
  },
  refundDate: {
    type: Date,
  },
});

const LoanRequest = mongoose.model("LoanRequest", loanRequestSchema);

module.exports.LoanRequest = LoanRequest;
