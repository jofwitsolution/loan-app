const jwt = require("jsonwebtoken");
const { User } = require("../models/User");

const jwt_secret = process.env.JWT_PRIVATE_KEY;

const isLogin = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, jwt_secret);

      req.user = await User.findById(decoded._id).select("-password");
      if (!req.user) {
        throw new Error("Invalid user");
      }

      next();
    } catch (error) {
      console.log(error);
      res.status(401).json({ success: false, msg: "Please login to continue" });
      return;
    }
  } else {
    res.status(401).json({ success: false, msg: "Please login to continue" });
  }
};

const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin" || !req.user.isAuthorizedAdmin) {
    res.status(401).json({ success: false, msg: "You are not an admin" });
  }

  next();
};

module.exports.isLogin = isLogin;
module.exports.isAdmin = isAdmin;