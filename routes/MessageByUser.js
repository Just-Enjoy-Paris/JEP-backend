const express = require("express");
const messageByUserRouter = express.Router();
const messageByUserController = require("../controllers/messageByUser.controllers");
const isAuthenticated = require("../middlewares/isAuth");
const {
  sendMessage
} = require("../controllers/messageByUser.controllers");

messageByUserRouter.post("/user/sendMessage", (req, res) => {
  sendMessage(req, res)
});
/*messageByUserRouter.get("/messages", (req, res) => {
  getMessages(req, res)
});*/

module.exports = messageByUserRouter;
