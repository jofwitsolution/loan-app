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
    enum: ["pending", "declined", "accepted", "canceled"],
    required: true,
    default: "pending",
  },
  isActive: {
    type: Boolean,
    default: false,
  },
  requestDate: {
    type: Date,
    default: Date.now,
  },
  dueDate: {
    type: Date,
  },
  returnDate: {
    type: Date,
  },
  actionDate: {
    type: Date,
  },
  comment: {
    type: String,
  },
});

const LoanRequest = mongoose.model("LoanRequest", loanRequestSchema);

module.exports.LoanRequest = LoanRequest;
