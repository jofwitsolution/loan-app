const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
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
      enum: ["successful"],
      required: true,
      default: "successful",
    },
    adminType: {
      type: String,
      enum: ["pay-out", "pay-in", "withdrawal"],
      required: true,
    },
    userType: {
      type: String,
      enum: ["pay-out", "pay-in", "withdrawal"],
      required: true,
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

const Transaction = mongoose.model("Transaction", transactionSchema);

module.exports.Transaction = Transaction;
