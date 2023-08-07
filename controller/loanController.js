const { User } = require("../models/User");
const { LoanRequest } = require("../models/LoanRequest");

// @Method: GET /loans
// @Desc: Get all loan requests
// @Access: private/admin
const getAllLoanRequests = async (req, res, next) => {
  try {
    const loanRequests = await LoanRequest.find({}).populate({
      path: "user",
      select: "firstName lastName accountBalance email",
    });

    res.json({ loanRequests });
  } catch (error) {
    next(error);
  }
};

module.exports.getAllLoanRequests = getAllLoanRequests;
