const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../models/User");
const {
  validateSignup,
  validateLogin,
} = require("../lib/validation/userValidation");

// @Method: POST /auth/signup
// @Desc: User signup
// @Access: public
const signup = async (req, res, next) => {
  try {
    // validate
    const error = await validateSignup(req.body);
    if (error) {
      res.status(400).json({ msg: error, success: false });
      return;
    }

    const { firstName, lastName, email, phone, password } = req.body;

    // check if phone exist
    const phoneExist = await User.findOne({ phone });
    if (phoneExist) {
      res
        .status(400)
        .json({ msg: "Phone number already exist", success: false });
      return;
    }

    // check if user exist
    const userExist = await User.findOne({ email });
    if (userExist) {
      res.status(400).json({ msg: "Email already exist", success: false });
      return;
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
  } catch (error) {
    next(error);
  }
};

// @Method: POST /auth/login
// @Desc: User login
// @Access: public
const login = async (req, res, next) => {
  try {
    // validate
    const error = await validateLogin(req.body);
    if (error) {
      res.status(400).json({ msg: error, success: false });
      return;
    }

    const { email, password } = req.body;

    // check if user exist
    const user = await User.findOne({ email });
    if (!user) {
      res
        .status(400)
        .json({ msg: "Invalid email or password", success: false });
      return;
    }

    // Compare password
    const valid = await bcryptjs.compare(password, user.password);
    if (!valid) {
      res
        .status(400)
        .json({ msg: "Invalid email or password", success: false });
      return;
    }

    const payload = {
      email: user.email,
      _id: user._id,
    };

    const token = jwt.sign(payload, process.env.JWT_PRIVATE_KEY, {
      expiresIn: "1d",
    });

    res
      .status(200)
      .json({ success: true, msg: "Log in successful", jwt: token });
  } catch (error) {
    next(error);
  }
};

module.exports.signup = signup;
module.exports.login = login;
