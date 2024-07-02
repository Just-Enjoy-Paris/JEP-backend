const mongoose = require("mongoose");

const messageByUserSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  email: {
    type: String,
    required: true,
    match: /.+\@.+\..+/,
  },
  subject: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const UserMessage = mongoose.model("UserMessage", messageByUserSchema);

module.exports = UserMessage;
