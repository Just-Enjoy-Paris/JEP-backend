const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  username: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: true,
    match: /.+\@.+\..+/, // Simple regex for email validation
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

messageSchema.methods.formatDate = function () {
  const date = this.date.toISOString();
  return date.substring(0, 10) + " " + date.substring(11, 19);
};

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;