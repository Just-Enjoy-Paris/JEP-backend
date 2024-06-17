const User = require("../models/Users.model");
const jwt = require("jsonwebtoken");
const { hashPassword, verifyPassword } = require("../utils/hashpass");
const cloudinary = require("cloudinary").v2;
const convertToBase64 = require("../utils/convertToBase64");
require("dotenv").config();

// Function to get the logged-in user's information
const getUser = async (req, res) => {
  try {
    const user = req.user;
    const userData = { ...user._doc, hashpass: undefined }; // Remove the password hash from user data

    res.status(200).json({
      userData, // Send user data without the password hash
    });
  } catch (err) {
    res.status(500).json({
      message: "An error has occurred",
      err: err.message,
    });
  }
};

// Function for user signup
const signup = async (req, res) => {
  try {
    const { email, username, password } = req.body; // Get signup details from the request body

    if (!email || !username || !password) {
      return res.status(400).json({
        message: "Please provide all fields.", // Ensure all fields are provided
      });
    }

    const userEmail = await User.findOne({ email }); // Check if the email is already in use

    if (userEmail) {
      return res.status(400).json({ message: "The email is already in use." });
    }

    const newUser = new User({
      email,
      account: {
        username,
      },
      hashpass: hashPassword(password), // Hash the password before storing
    });

    await newUser.save(); // Save the new user in the database

    res.status(201).json({ message: "Signup successful." });
  } catch (err) {
    res.status(500).json({
      message: "An error occurred during signup.",
      error: err.message,
    });
  }
};

// Function for user login
const login = async (req, res) => {
  try {
    const { email, password } = req.body; // Get login details from the request body
    if (!email || !password) {
      return res.status(400).json({
        message: "Please provide all fields.",
      });
    }

    const user = await User.findOne({ email }); // Find the user in the database

    if (!user) {
      return res.status(401).json({
        message: "Incorrect email or password.",
      });
    }

    const passwordMatch = await verifyPassword(user.hashpass, password); // Verify the password

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Incorrect email or password.",
      });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET); // Generate a JWT token

    res.cookie("JEP", token, {
      httpOnly: true,
      sameSite: "none",
      secure: process.env.JWT_SECURE_COOKIE,
      maxAge: parseInt(process.env.JWT_EXPIRATION, 10),
    });

    res.status(200).json({ message: "Login successful." });
  } catch (err) {
    res.status(500).json({
      message: "An error occurred during login.",
      error: err.message,
    });
  }
};

// Function to update user profile
const updateprofile = async (req, res) => {
  try {
    const { newEmail, newPassword, newUsername } = req.body;
    const user = req.user;

    // Update email if provided and different from the current one
    if (newEmail && newEmail !== user.email) {
      const emailExists = await User.findOne({ email: newEmail });
      if (emailExists) {
        return res.status(400).json({
          message: "The email is already in use by another account.",
        });
      }
      user.email = newEmail;
    }

    // Update avatar if provided
    if (req.files && req.files.newAvatar) {
      const avatarFile = req.files.newAvatar;
      const AvatarToString = convertToBase64(avatarFile);
      const avatarToSave = await cloudinary.uploader.upload(AvatarToString, {
        folder: "jep/users/avatar",
      });
      user.account.avatar = avatarToSave.secure_url;
    }

    // Update password if provided
    if (newPassword) {
      user.hashpass = hashPassword(newPassword);
    }

    // Update username if provided
    if (newUsername) {
      user.account.username = newUsername;
    }

    await user.save(); // Save the updated user details

    res.status(200).json({ message: "Profile updated successfully." });
  } catch (err) {
    res.status(500).json({
      message: "An error occurred while updating the profile.",
      error: err.message,
    });
  }
};

// Function to add a favorite place
const addFav = async (req, res) => {
  try {
    const { id } = req.body;
    const user = req.user;

    if (!id) {
      return res.status(400).json({
        message: "No favorite to add",
      });
    }
    if (user.account.favPlaces.includes(id)) {
      return res.json({ message: "Favorite already added" });
    }
    if (!user.account.favPlaces.includes(id)) {
      user.account.favPlaces.push(id);

      await user.save(); // Save the updated favorites

      console.log(user.account.favPlaces);
      res.status(201).json({
        message: "Favorite added",
        favPlaces: user.account.favPlaces,
      });
    }
  } catch (err) {
    res.status(500).json({
      message: "An error occurred while updating favorites.",
      error: err.message,
    });
  }
};

// Function to remove a favorite place
const rmFav = async (req, res) => {
  try {
    const { id } = req.body;
    const user = req.user;

    if (!id) {
      return res.status(400).json({
        message: "No ID received",
      });
    }

    user.account.favPlaces = user.account.favPlaces.filter(
      favId => favId !== id
    );
    await user.save(); // Save the updated favorites list
    console.log(user.account.favPlaces);
    res.status(200).json({
      message: "Favorite removed",
      favPlaces: user.account.favPlaces,
    });
  } catch (err) {
    res.status(500).json({
      message: "An error occurred while removing the favorite.",
      error: err.message,
    });
  }
};

module.exports = { getUser, signup, login, updateprofile, addFav, rmFav };
