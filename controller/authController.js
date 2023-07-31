const bcryptjs = require("bcryptjs");
const { User } = require("../models/User");
const { validateSignup } = require("../validation/userValidation");

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

    const { firstName, lastName, email, password } = req.body;

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
      password: hashedPassword,
    });

    await user.save();

    res.status(201).json({ success: true, msg: "Sign up successful" });
  } catch (error) {
    next(error);
  }
};

module.exports.signup = signup;
