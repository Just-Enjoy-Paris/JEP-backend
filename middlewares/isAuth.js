const jwt = require("jsonwebtoken");
const User = require("../models/Users.model");
require("dotenv").config();

// Middleware to check if the user is authenticated
const isAuthenticated = async (req, res, next) => {
  try {
    // Get the token from cookies
    const token = req.cookies.JEP;

    if (!token) {
      // Return error if token is not found
      return res.status(401).json({ message: "Unauthorized, token" });
    }

    // Verify the token and extract userId
    const { userId } = jwt.verify(token, process.env.JWT_SECRET);

    if (!userId) {
      // Return error if userId is not found
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Find the user by userId
    const user = await User.findById(userId);

    if (!user) {
      // Return error if user is not found
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Attach the user to the request object
    req.user = user;

    // Proceed to the next middleware or route handler
    next();
  } catch (err) {
    res.status(401).json({
      message: "Unauthorized", // Return error if any exception occurs
      err: err.message,
    });
  }
};

// Export the isAuthenticated middleware
module.exports = isAuthenticated;
