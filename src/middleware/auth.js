const jwt = require("jsonwebtoken");
require("dotenv").config();

const whitelist = ["/", "/login", "/register"];

const auth = (req, res, next) => {
  if (whitelist.includes(req.path)) {
    return next();
  } else {
    if (req?.headers?.authorization?.split(" ")[1]) {
      const token = req.headers.authorization.split(" ")[1];
      //   console.log("check token:", token);

      //   verify
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // console.log("check decoded: ", decoded);
        req.user = decoded;
        next();
      } catch (error) {
        return res.status(401).json({
          message: "Token expired or invalid",
        });
      }
    } else {
      res.status(401).json({
        message: "Unauthorized",
      });
    }
  }
};

module.exports = auth;
