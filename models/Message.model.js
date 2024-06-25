const mongoose = require("mongoose");
// retirer username du message et refaire un model pour les messages
//des users avec un compte(inclure id : ref user, message et date)
// la methode en bas ne sert a rien , le .now le fait automatiquement

const messageSchema = new mongoose.Schema({
  username: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: true,
    match: /.+\@.+\..+/,
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

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
