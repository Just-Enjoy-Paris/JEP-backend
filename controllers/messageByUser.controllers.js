const MessageByUser = require("../models/MessageByUser.model");

const sendMessage = async (req, res) => {
  try {
    const { username, email, message } = req.body;
    const newMessage = new MessageByUser({ username, email, message });
    await newMessage.save();
    res.status(201).json({ message: "Votre message a été envoyé avec succès !" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Une erreur est survenue lors de l'envoi du message." });
  }
};

const getMessages = async (req, res) => {
  try {
    const messages = await MessageByUser.find({});
    const formattedMessages = messages.map((message) => {
      const formattedDate = message.formatDate();
      return { ...message.toObject(), date: formattedDate };
    });
    res.json(formattedMessages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Une erreur est survenue lors de la récupération des messages." });
  }
};

module.exports = { sendMessage, getMessages };
