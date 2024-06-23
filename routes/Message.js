const express = require("express");
const messageRouter = express.Router();
const messageController = require("../controllers/message.controllers");

messageRouter.post("/addMessage", messageController.addMessage);
messageRouter.get("/messages", messageController.getMessages);

module.exports = messageRouter;
