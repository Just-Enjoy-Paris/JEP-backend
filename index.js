// import d'express, mongoose, cors
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const cloudinary = require("cloudinary").v2;

// Je me connecte au serveur de BDD
require("./database/database.conection");

// Je me connecte à cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// Création du serveur
const app = express();

// Option de requette
const corsOptions = {
  credentials: true,
  optionsSuccessStatus: 200,
  origin: process.env.ORIGIN,
};

// utilisation des options de cors

app.use(cors(corsOptions));

// utilisation d'express.json() pour pouvoir récupérer des body dans nos routes

app.use(express.json());

// utilisation de cookieparser

app.use(cookieParser());

// Import des routes
const placesRoutes = require("./routes/Places");
const userRoutes = require("./routes/User");
const resetRoutes = require("./routes/ResetRoutes");

app.use(placesRoutes);
app.use(userRoutes);
app.use(resetRoutes);

app.all("*", (req, res) => {
  res.status(404).json({ message: "This route does not exist" });
});

app.listen(process.env.PORT, () => {
  console.log("Server started");
});
