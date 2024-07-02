const Message = require("../models/Message.model");
const UserMessage = require("../models/MessageByUser.model");

const sendMessage = async (req, res) => {
  try {
    const { email, subject, message } = req.body;
    const newMessage = new Message({ email, subject, message });
    await newMessage.save();
    res
      .status(201)
      .json({ message: "Votre message a été envoyé avec succès !" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Une erreur est survenue lors de l'envoi du message." });
  }
};

const sendMessageByUser = async (req, res) => {
  try {
    const user = req.user;
    const { email, subject, message } = req.body;
    const newMessage = new UserMessage({
      email,
      subject,
      message,
      userId: user._id,
    });
    await newMessage.save();
    res
      .status(201)
      .json({ message: "Votre message a été envoyé avec succès !" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Une erreur est survenue lors de l'envoi du message." });
  }
};

const getMessages = async (req, res) => {
  try {
    const messages = await Message.find().lean();
    const usermessages = await UserMessage.find().lean();
    const allMessages = [...messages, ...usermessages];
    res.status(200).json(allMessages);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Une erreur est survenue lors de la récupération des messages.",
    });
  }
};

module.exports = { sendMessage, getMessages, sendMessageByUser };
