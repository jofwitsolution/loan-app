const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../models/User");
const {
  validateSignup,
  validateLogin,
} = require("../lib/validation/userValidation");
const { BadRequestError } = require("../lib/error");

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

  res.cookie(
    "session",
    { role: "user" },
    {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      signed: true,
      expires: new Date(Date.now() + oneDay),
    }
  );
  res.cookie("accessToken", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    signed: true,
    expires: new Date(Date.now() + oneDay),
  });

  res.status(200).json({ success: true, msg: "Log in successful" });
};

module.exports.signup = signup;
module.exports.login = login;
