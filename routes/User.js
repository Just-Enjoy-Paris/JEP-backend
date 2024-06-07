const express = require("express");
const userRouter = express.Router();
const fileUpload = require("express-fileupload");
const isAuthenticated = require("../middlewares/isAuth");
const {
  getUser,
  signup,
  login,
  updateprofile,
  addFav,
  rmFav,
} = require("../controllers/user.controllers");

userRouter.get("/fetchuser", isAuthenticated, (req, res) => {
  getUser(req, res);
});

userRouter.post("/signup", (req, res) => {
  signup(req, res);
});

userRouter.post("/login", (req, res) => {
  login(req, res);
});

userRouter.put("/updateprofile", isAuthenticated, fileUpload(), (req, res) => {
  updateprofile(req, res);
});

userRouter.put("/addFav", isAuthenticated, (req, res) => {
  addFav(req, res);
});

userRouter.put("/rmFav", isAuthenticated, (req, res) => {
  rmFav(req, res);
});

userRouter.delete("/logout", async (req, res) => {
  res.clearCookie("JEP");
  res.status(200).json({ message: "Déconnecté." });
});

module.exports = userRouter;
