const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      res.status(400).send("Please Login");
      return;  // Prevent further execution
    }

    const decodedToken = await jwt.verify(token, "Niet@123");
    const { _id } = decodedToken;
    const user = await User.findById(_id);
    console.log(user);

    if (!user) {
      throw new Error("User not found");
    }

    req.user = user;
    next();  // Proceed to the next middleware/route handler

  } catch (error) {
    // Send error response only if headers haven't been sent
    if (!res.headersSent) {
      res.status(400).send(`Error Message: ${error.message}`);
    }
  }
};

module.exports = {
  userAuth,
};
