const Message = require("../models/Message.model");

const addMessage = async (req, res) => {
  try {
    const { username, email, message } = req.body;
    const newMessage = new Message({ username, email, message });
    await newMessage.save();
    res.status(201).json({ message: "Votre message a été envoyé avec succès !" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Une erreur est survenue lors de l'envoi du message." });
  }
};

const getMessages = async (req, res) => {
  try {
    const messages = await Message.find({});
    res.json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Une erreur est survenue lors de la récupération des messages." });
  }
};

module.exports = { addMessage, getMessages };
