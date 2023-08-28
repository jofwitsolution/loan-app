const jwt = require("jsonwebtoken");
const { User } = require("../models/User");

const jwt_secret = process.env.JWT_PRIVATE_KEY;

const isLogin = async (req, res, next) => {
  // console.log(
  //   req.protocol,
  //   req.hostname,
  //   req.socket?.remotePort,
  //   req.originalUrl
  // );

  const { accessToken } = req.signedCookies;
  // console.log(accessToken);
  if (accessToken) {
    try {
      const decoded = jwt.verify(accessToken, jwt_secret);

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
    res.status(403).json({ success: false, msg: "You are not an admin" });
    return;
  }

  next();
};

module.exports.isLogin = isLogin;
module.exports.isAdmin = isAdmin;
