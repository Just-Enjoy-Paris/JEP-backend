const User = require("../models/Users.model");
const jwt = require("jsonwebtoken");
const { hashPassword, verifyPassword } = require("../utils/hashpass");
const cloudinary = require("cloudinary").v2;
const convertToBase64 = require("../utils/convertToBase64");
require("dotenv").config();
const Place = require("../models/Places.model");

const getUser = async (req, res) => {
  try {
    const user = req.user;

    const userData = { ...user._doc, hashpass: undefined };

    res.status(200).json({
      userData,
    });
  } catch (err) {
    res.status(500).json({
      message: "An error has occurred",
      err: err.message,
    });
  }
};

const signup = async (req, res) => {
  try {
    const { email, username, password } = req.body;

    if (!email || !username || !password) {
      return res.status(400).json({
        message: "Veuillez fournir tous les champs.",
      });
    }

    const userEmail = await User.findOne({ email });

    if (userEmail) {
      return res.status(400).json({ message: "L'email est déjà utilisé." });
    }

    const newUser = new User({
      email,
      account: {
        username,
      },
      hashpass: hashPassword(password),
    });

    await newUser.save();

    res.status(201).json({ message: "Inscription réussie." });
  } catch (err) {
    res.status(500).json({
      message: "Une erreur est survenue lors de l'inscription.",
      error: err.message,
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        message: "Veuillez fournir tous les champs.",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "Email ou mot de passe incorrect.",
      });
    }

    const passwordMatch = await verifyPassword(user.hashpass, password);

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Email ou mot de passe incorrect.",
      });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

    res.cookie("JEP", token, {
      httpOnly: true,
      sameSite: "none",
      secure: process.env.JWT_SECURE_COOKIE,
      maxAge: parseInt(process.env.JWT_EXPIRATION, 10),
    });

    res.status(200).json({ message: "Connexion réussie." });
  } catch (err) {
    res.status(500).json({
      message: "Une erreur est survenue lors de la connexion.",
      error: err.message,
    });
  }
};

const updateprofile = async (req, res) => {
  try {
    const { newEmail, newPassword, newUsername } = req.body;
    const user = req.user;

    // Mise à jour de l'email si fourni et s'il est différent de l'actuel
    if (newEmail && newEmail !== user.email) {
      const emailExists = await User.findOne({ email: newEmail });
      if (emailExists) {
        return res.status(400).json({
          message: "L'email est déjà utilisé par un autre compte.",
        });
      }
      user.email = newEmail;
    }

    // Mise à jour de l'avatar si fourni
    if (req.files && req.files.newAvatar) {
      const avatarFile = req.files.newAvatar;
      const AvatarToString = convertToBase64(avatarFile);
      const avatarToSave = await cloudinary.uploader.upload(AvatarToString, {
        folder: "jep/users/avatar",
      });
      user.account.avatar = avatarToSave.secure_url;
    }

    // Mise à jour du mot de passe si fourni
    if (newPassword) {
      user.hashpass = hashPassword(newPassword);
    }

    // Mise à jour de username si fourni
    if (newUsername) {
      user.account.username = newUsername;
    }

    await user.save();

    res.status(200).json({ message: "Profil mis à jour avec succès." });
  } catch (err) {
    res.status(500).json({
      message: "Une erreur est survenue lors de la mise à jour du profil.",
      error: err.message,
    });
  }
};

// const addFav = async (req, res) => {
//   try {
//     const { id } = req.body;
//     const user = req.user;

//     if (!id) {
//       return res.status(400).json({
//         message: "Aucun favori à ajouter",
//       });
//     }

//     const place = await Place.findById(id);

//     if (!place) {
//       return res.status(404).json({
//         message: "Lieu non trouvé",
//       });
//     }

//     console.log(place);
//     if (user.account.favPlaces.includes(place.properties)) {
//       return res.json({ message: "favori déja ajouté" });
//     }
//     if (!user.account.favPlaces.includes(place.properties)) {
//       user.account.favPlaces.push(place.properties);

//       await user.save();

//       res.status(201).json({
//         message: "Favori ajouté",
//         favPlaces: user.account.favPlaces,
//       });
//     }
//   } catch (err) {
//     res.status(500).json({
//       message: "Une erreur est survenue lors de la mise à jour des favoris.",
//       error: err.message,
//     });
//   }
// };

const addFav = async (req, res) => {
  try {
    const { id } = req.body;
    const userId = req.user._id;

    if (!id) {
      return res.status(400).json({
        message: "Aucun favori à ajouter",
      });
    }

    const place = await Place.findById(id).lean();
    if (!place) {
      return res.status(404).json({
        message: "Lieu non trouvé",
      });
    }

    // Utilisation de findOneAndUpdate pour ajouter le favori si ce n'est pas déjà dans la liste
    const updatedUser = await User.findOneAndUpdate(
      { _id: userId, "account.favPlaces": { $ne: place.properties } },
      { $addToSet: { "account.favPlaces": place.properties } },
      { new: true }
    ).lean();

    if (!updatedUser) {
      return res.json({ message: "Favori déjà ajouté" });
    }

    res.status(201).json({
      message: "Favori ajouté",
      favPlaces: updatedUser.account.favPlaces,
    });
  } catch (err) {
    res.status(500).json({
      message: "Une erreur est survenue lors de la mise à jour des favoris.",
      error: err.message,
    });
  }
};

const rmFav = async (req, res) => {
  try {
    const { id } = req.body;
    const userId = req.user._id;

    if (!id) {
      return res.status(400).json({
        message: "Aucun favori à supprimer",
      });
    }

    const place = await Place.findById(id).lean();
    if (!place) {
      return res.status(404).json({
        message: "Lieu non trouvé",
      });
    }

    // Utilisation de findOneAndUpdate pour supprimer le favori de la liste
    const updatedUser = await User.findOneAndUpdate(
      { _id: userId },
      { $pull: { "account.favPlaces": place.properties } },
      { new: true }
    ).lean();

    res.status(200).json({
      message: "Favori supprimé",
      favPlaces: updatedUser.account.favPlaces,
    });
  } catch (err) {
    res.status(500).json({
      message: "Une erreur est survenue lors de la mise à jour des favoris.",
      error: err.message,
    });
  }
};

// const rmFav = async (req, res) => {
//   try {
//     const { id } = req.body;
//     const user = req.user;

//     if (!id) {
//       return res.status(400).json({
//         message: "Aucun ID reçu",
//       });
//     }

//     user.account.favPlaces = user.account.favPlaces.filter(
//       favId => favId !== id
//     );
//     await user.save();
//     console.log(user.account.favPlaces);
//     res.status(200).json({
//       message: "Favori supprimé",
//       favPlaces: user.account.favPlaces,
//     });
//   } catch (err) {
//     res.status(500).json({
//       message: "Une erreur est survenue lors de la suppression du favori.",
//       error: err.message,
//     });
//   }
// };

module.exports = { getUser, signup, login, updateprofile, addFav, rmFav };
