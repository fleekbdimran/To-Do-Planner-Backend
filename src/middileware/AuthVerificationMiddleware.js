const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  let token = req.headers["token"];

  if (!token) {
    return res.status(200).json({ status: "fail", message: "Token not provided" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(200).json({ status: "fail", message: "Unauthorized" });
    } else {
      req.headers.email = decoded.email; //use decoded.email
      next();
    }
  });
};
