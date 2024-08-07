const express = require("express");
const messageRouter = express.Router();
const isAuthenticated = require("../middlewares/isAuth");
const {
  sendMessage,
  getMessages,
  sendMessageByUser,
} = require("../controllers/message.controllers");

messageRouter.post("/sendMessage", (req, res) => {
  sendMessage(req, res);
});

messageRouter.post("/user/sendMessage", isAuthenticated, (req, res) => {
  sendMessageByUser(req, res);
});

messageRouter.get("/messages", (req, res) => {
  getMessages(req, res);
});

module.exports = messageRouter;
