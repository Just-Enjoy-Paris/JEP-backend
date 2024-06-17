const mongoose = require("mongoose");

// Connect to the MongoDB database using the URL from environment variables
const db = mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    // Log success message when the database connection is established
    console.log("DataBase connected");
  })
  .catch(err => {
    // Log error message if there is an issue connecting to the database
    console.error(err);
  });

module.exports = db;
