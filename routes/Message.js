const express = require("express");
const messageRouter = express.Router();
const messageController = require("../controllers/message.controllers");
const isAuthenticated = require("../middlewares/isAuth");
const {
  addMessage,
  getMessages
} = require("../controllers/message.controllers");

messageRouter.post("/addMessage", (req, res) => {
  addMessage(req, res)
});
messageRouter.get("/messages", (req, res) => {
  getMessages(req, res)
});

module.exports = messageRouter;
