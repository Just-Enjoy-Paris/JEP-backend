const MessageByUser = require("../models/MessageByUser.model");

const sendMessage = async (req, res) => {
  try {
    const { email, subject, message } = req.body;
    const newMessage = new MessageByUser({ email, subject, message });
    await newMessage.save();
    res.status(201).json({ message: "Votre message a été envoyé avec succès !" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Une erreur est survenue lors de l'envoi du message." });
  }
};

module.exports = { sendMessage };
