const { User } = require("../models/User");

// @Method: GET /users
// @Desc: Get all users
// @Access: private/admin
const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({}).select("-password -isAuthorizedAdmin");

    res.json({ success: true, users });
  } catch (error) {
    next(error);
  }
};

// @Method: GET /users/:id/profile
// @Desc: User profile
// @Access: private
const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select(
      "-password -isAuthorizedAdmin"
    );
    if (!user) {
      res.status(404).json({ success: false, msg: "User not found" });
      return;
    }

    res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

module.exports.getProfile = getProfile;
module.exports.getUsers = getUsers;
