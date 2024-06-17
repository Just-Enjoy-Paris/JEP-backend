// Import express, cors, cookie-parser, dotenv, and cloudinary
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const cloudinary = require("cloudinary").v2;

// Connect to the database server
require("./database/database.conection");

// Connect to Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// Create the server
const app = express();

// CORS options
const corsOptions = {
  credentials: true,
  optionsSuccessStatus: 200,
  origin: process.env.ORIGIN,
};

// Use CORS with the specified options
app.use(cors(corsOptions));

// Use express.json() to parse JSON bodies in routes
app.use(express.json());

// Use cookie-parser to parse cookies in requests
app.use(cookieParser());

// Import routes
const placesRoutes = require("./routes/Places");
const userRoutes = require("./routes/User");
const resetRoutes = require("./routes/ResetRoutes");

// Use the imported routes
app.use(placesRoutes);
app.use(userRoutes);
app.use(resetRoutes);

// Catch-all route for undefined routes
app.all("*", (req, res) => {
  res.status(404).json({ message: "This route does not exist" });
});

// Start the server and listen on the specified port
app.listen(process.env.PORT, () => {
  console.log("Server started");
});
