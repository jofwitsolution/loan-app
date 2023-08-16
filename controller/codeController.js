const { SignupCode } = require("../models/SignupCode");

// @Method: POST /codes
// @Desc:  Create code
// @Access: private/admin
const createSignupCode = async (req, res, next) => {
  try {
    // validate
    if (!req.body.code || req.body.email) {
      res.status(400).json({ success: false, msg: "Invalid code or email" });
      return;
    }

    const { code, email } = req.body;
    const codeExist = await SignupCode.findOne({ code });
    if (codeExist) {
      res.status(400).json({ success: false, msg: "Code already exist." });
      return;
    }

    const signupCode = await SignupCode.create({
      code,
      email,
    });

    res
      .status(201)
      .json({ success: true, msg: "Code successfully created.", signupCode });
  } catch (error) {
    next(error);
  }
};

// @Method: GET /codes
// @Desc:  GET All codes
// @Access: private/admin
const getAllSignupCodes = async (req, res, next) => {
  try {
    const signupCodes = await SignupCode.find({});

    res.json({ success: true, signupCodes });
  } catch (error) {
    next(error);
  }
};

// @Method: DELETE /codes/:id
// @Desc:  Delete a code
// @Access: private/admin
const deleteSignupCode = async (req, res, next) => {
  try {
    const signupCodes = await SignupCode.findOneAndDelete({
      _id: req.params.id,
    });
    if (!signupCodes) {
      res
        .status(404)
        .json({ success: false, msg: "Code to delete not found." });
      return;
    }

    res.json({ success: true, msg: "Code successfully deleted." });
  } catch (error) {
    next(error);
  }
};

module.exports.createSignupCode = createSignupCode;
module.exports.getAllSignupCodes = getAllSignupCodes;
module.exports.deleteSignupCode = deleteSignupCode;
