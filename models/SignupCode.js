const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    code: {
      type: String,
      maxlength: 10,
      unique: true,
    },
    isValid: {
      type: Boolean,
      default: true,
    },
    email: {
      type: String,
      maxlength: 40,
    },
  },
  { timestamps: true }
);

const SignupCode = mongoose.model("SignupCode", schema);

module.exports.SignupCode = SignupCode;
