const mongoose = require("mongoose");

const db = mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("DataBase conected");
  })
  .catch(err => console.error(err));

module.exports = db;
