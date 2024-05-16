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
    console.log(req.body);
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        message: "Veuillez fournir tous les champs.",
      });
    }

    const userEmail = await User.findOne({ email });

    if (!userEmail) {
      return res.status(401).json({
        message: "Email ou mot de passe incorrect.",
      });
    }

    const passwordMatch = bcrypt.compare(
      password,
      userEmail.hashpass
    );

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Email ou mot de passe incorrect.",
      });
    }

    const token = jwt.sign(
      { userId: userEmail._id },
      process.env.JWT_SECRET
    );

    res.cookie("JEP", token, {
      sameSite: "none",
      secure: process.env.JWT_SECURE,
      maxAge: parseInt(process.env.JWT_EXPIRATION, 10),
    });

    // res.status(200).json({ message: "Connexion réussie." });
    res
      .status(200)
      .json({ ...userEmail._doc, password: undefined, token });
    console.log({ ...userEmail._doc, password: undefined, token });
  } catch (err) {
    res.status(500).json({
      message: "Une erreur est survenue lors de la connexion.",
      error: err.message,
    });
  }
});

userRouter.get("/refresh", isAuthenticated, async (req, res) => {
  try {
    const user = req.user;

    res.status(200).json({ ...user._doc, password: undefined });
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
