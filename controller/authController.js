const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../models/User");
const {
  validateSignup,
  validateLogin,
} = require("../lib/validation/userValidation");
const { BadRequestError } = require("../lib/error");
const {
  sendPasswordResetEmail,
} = require("../lib/message/password-reset-message");
const {
  sendSuccessPasswordResetEmail,
} = require("../lib/message/successful-password-reset-message");
const { StatusCodes } = require("http-status-codes");
const { sendActivationEmail } = require("../lib/message/activation-message");
const sendSMS = require("../lib/message/send-sms");

// @Method: POST /auth/signup
// @Desc: User signup
// @Access: public
const signup = async (req, res, next) => {
  // validate
  const error = await validateSignup(req.body);
  if (error) {
    throw new BadRequestError(error);
  }

  const { firstName, lastName, email, phone, password } = req.body;

  // check if phone exist
  const phoneExist = await User.findOne({ phone });
  if (phoneExist) {
    throw new BadRequestError("Phone number already exists.");
  }

  // check if user exist
  const userExist = await User.findOne({ email });
  if (userExist) {
    throw new BadRequestError("Email already exists.");
  }

  // Hash password
  const salt = await bcryptjs.genSalt(10);
  const hashedPassword = await bcryptjs.hash(password, salt);

  // Create the user
  const user = new User({
    firstName,
    lastName,
    email,
    phone,
    password: hashedPassword,
  });

  await user.save();

  // const token = await bcryptjs.hash(user.email.toString(), 10);

  // await sendActivationEmail({email, firstName, token})

  res.status(201).json({ success: true, msg: "Sign up successful" });
};

// @Method: POST /auth/login
// @Desc: User login
// @Access: public
const login = async (req, res, next) => {
  // validate
  const error = await validateLogin(req.body);
  if (error) {
    throw new BadRequestError(error);
  }

  const { email, password } = req.body;

  // check if user exist
  const user = await User.findOne({ email });
  if (!user) {
    throw new BadRequestError("Invalid email or password");
  }

  // Compare password
  const valid = await bcryptjs.compare(password, user.password);
  if (!valid) {
    throw new BadRequestError("Invalid email or password");
  }

  const payload = {
    email: user.email,
    _id: user._id,
  };

  const token = jwt.sign(payload, process.env.JWT_PRIVATE_KEY);

  const oneDay = 1000 * 60 * 60 * 24;

  // const messageRes = await sendSMS({
  //   phone: "+2348137192766",
  //   message: "Testing twilio sms.",
  // });
  // console.log(messageRes);

  let isSecureCookie = false;
  let sameSiteCookie = "Lax";
  if (process.env.NODE_ENV === "production") {
    isSecureCookie = true;
    sameSiteCookie = "None";
  }

  res.cookie(
    "session",
    { role: "user" },
    {
      httpOnly: false,
      secure: isSecureCookie,
      signed: true,
      expires: new Date(Date.now() + oneDay),
      sameSite: sameSiteCookie,
    }
  );
  res.cookie("accessToken", token, {
    httpOnly: true,
    secure: isSecureCookie,
    signed: true,
    expires: new Date(Date.now() + oneDay),
    sameSite: sameSiteCookie,
  });

  res
    .status(200)
    .json({ success: true, msg: "Log in successful", role: user.role });
};

// @Method: Delete /auth/logout
// @Desc: Logout
// @Access: private
const logout = async (req, res) => {
  res.cookie("session", "logout", {
    httpOnly: false,
    expires: new Date(Date.now()),
  });
  res.cookie("accessToken", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });

  res.status(StatusCodes.OK).json({ success: true, msg: "user logged out!" });
};

// @Method: POST /auth/forgot-password
// @Desc: Forgot password
// @Access: public
const forgotPassword = async (req, res) => {
  // validation
  const { email } = req.body;
  if (!email) {
    throw new BadRequestError("Invalid email");
  }

  // check if user exist
  const user = await User.findOne({ email });
  if (!user) {
    throw new BadRequestError("Email does not exist");
  }

  const token = await bcryptjs.hash(user._id.toString(), 10);

  const expires = 1000 * 60 * 30; // 30 minutes
  user.resetPasswordToken = token;
  user.resetPasswordExpires = new Date(Date.now() + expires);

  await user.save();

  await sendPasswordResetEmail({ email, token });

  res.status(200).json({
    success: true,
    msg: "Check your email for a link to reset your password.",
  });
};

// @Method: POST /auth/reset-password?token=token
// @Desc: Reset password
// @Access: public
const resetPassword = async (req, res) => {
  // validation
  const { newPassword } = req.body;
  if (!newPassword) {
    throw new BadRequestError("Invalid password");
  }

  // check token
  const user = await User.findOne({
    resetPasswordToken: req.query.token,
    resetPasswordExpires: { $gt: Date.now() },
  });
  if (!user) {
    throw new BadRequestError("Link expired. Please, request new link.");
  }

  // Hash password
  const salt = await bcryptjs.genSalt(10);
  const hashedPassword = await bcryptjs.hash(newPassword, salt);

  user.password = hashedPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;

  await user.save();

  await sendSuccessPasswordResetEmail({
    email: user.email,
    firstName: user.firstName,
  });

  res.status(200).json({
    success: true,
    msg: "Password Reset Successful",
  });
};

module.exports.signup = signup;
module.exports.login = login;
module.exports.forgotPassword = forgotPassword;
module.exports.resetPassword = resetPassword;
module.exports.logout = logout;
