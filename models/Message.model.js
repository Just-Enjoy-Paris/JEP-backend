const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
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

messageSchema.methods.formatDate = function () {
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(this.date).toLocaleDateString("fr-FR", options);
};

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
