const { NotFoundError, BadRequestError } = require("../lib/error");
const { SignupCode } = require("../models/SignupCode");

// @Method: POST /codes
// @Desc:  Create code
// @Access: private/admin
const createSignupCode = async (req, res, next) => {
  // validate
  if (!req.body.code || req.body.email) {
    throw new BadRequestError("Invalid code or email");
  }

  const { code, email } = req.body;
  const codeExist = await SignupCode.findOne({ code });
  if (codeExist) {
    throw new BadRequestError("Code already exists.");
  }

  const signupCode = await SignupCode.create({
    code,
    email,
  });

  res
    .status(201)
    .json({ success: true, msg: "Code successfully created.", signupCode });
};

// @Method: GET /codes
// @Desc:  GET All codes
// @Access: private/admin
const getAllSignupCodes = async (req, res, next) => {
  const signupCodes = await SignupCode.find({});

  res.json({ success: true, signupCodes });
};

// @Method: DELETE /codes/:id
// @Desc:  Delete a code
// @Access: private/admin
const deleteSignupCode = async (req, res, next) => {
  const signupCodes = await SignupCode.findOneAndDelete({
    _id: req.params.id,
  });
  if (!signupCodes) {
    throw new NotFoundError("Code to delete not found.");
  }

  res.json({ success: true, msg: "Code successfully deleted." });
};

module.exports.createSignupCode = createSignupCode;
module.exports.getAllSignupCodes = getAllSignupCodes;
module.exports.deleteSignupCode = deleteSignupCode;
