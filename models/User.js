const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      maxlength: 50,
      trim: true,
      required: true,
    },
    lastName: {
      type: String,
      maxlength: 50,
      trim: true,
      required: true,
    },
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    imgUrl: {
      type: String,
      trim: true,
      default: "",
    },
    imgPath: {
      type: String,
      trim: true,
      default: "",
    },
    phoneNumber: { type: String, trim: true },
    password: {
      type: String,
      maxlength: 255,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    isAuthorizedAdmin: {
      type: Boolean,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
