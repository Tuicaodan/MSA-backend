const jwt = require("jsonwebtoken");

const authenticate = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1] || "";
  //console.log(token)

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    //console.log(verified.user)
    req.isAuth = true;
    req.verifiedUser = verified.user;
    //console.log("Verification success!", verified);
    next();
  } catch (err) {
    //console.log("Verification failed!");
    req.isAuth = false;
    next();
  }
};

module.exports = { authenticate };
