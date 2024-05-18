const express = require("express");
const userRouter = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/Users.model");
const isAuthenticated = require("../middlewares/isAuth");

require("dotenv").config();

userRouter.post("/signup", async (req, res) => {
  try {
    const { email, username, password } = req.body;

    if (!email || !username || !password) {
      return res.status(400).json({
        message: "Veuillez fournir tous les champs.",
      });
    }

    const userEmail = await User.findOne({ email });

    if (userEmail) {
      return res
        .status(400)
        .json({ message: "L'email est déjà utilisé." });
    }

    const hashPassw = await bcrypt.hash(password, 15);
    const newUser = new User({
      email,
      account: {
        username,
      },
      hashpass: hashPassw,
    });

    await newUser.save();

    res.status(201).json({ message: "Inscription réussie." });
  } catch (err) {
    res.status(500).json({
      message: "Une erreur est survenue lors de l'inscription.",
      error: err.message,
    });
  }
});

userRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        message: "Veuillez fournir tous les champs.",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "Email ou mot de passe incorrect.",
      });
    }

    const passwordMatch = await bcrypt.compare(
      password,
      user.hashpass
    );

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Email ou mot de passe incorrect.",
      });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET
    );

    res.cookie("JEP", token, {
      httpOnly: true,
      sameSite: "none",
      secure: process.env.JWT_SECURE_COOKIE,
      maxAge: parseInt(process.env.JWT_EXPIRATION, 10),
    });

    res.status(200).json({ message: "Connexion réussie." });
  } catch (err) {
    res.status(500).json({
      message: "Une erreur est survenue lors de la connexion.",
      error: err.message,
    });
  }
});

userRouter.get("/fetchuser", isAuthenticated, async (req, res) => {
  try {
    const user = req.user;
    const userData = {
      username: user.account.username,
      avatar: user.account.avatar,
    };

    res.status(200).json({
      userData,
    });
  } catch (err) {
    res.status(500).json({
      message: "An error has occurred",
      err: err.message,
    });
  }
});

userRouter.delete("/logout", async (req, res) => {
  res.clearCookie("JEP");
  res.status(200).json({ message: "Déconnecté." });
});

module.exports = userRouter;
