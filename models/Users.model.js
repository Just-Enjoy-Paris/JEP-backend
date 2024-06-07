const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    match: /.+\@.+\..+/, // Simple regex for email validation
  },
  account: {
    username: { type: String, required: true },
    avatar: { type: mongoose.Schema.Types.Mixed, default: "" },
    favPlaces: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    favTourstPlaces: [
      { type: mongoose.Schema.Types.ObjectId, ref: "TouristPlaces" },
    ],
    favGardens: [{ type: mongoose.Schema.Types.ObjectId, ref: "GardenPlace" }],
  },
  newsletter: { type: Boolean, default: false },
  hashpass: String,
});

const User = mongoose.model("User", userSchema);

module.exports = User;
