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
    favPlaces: [{ type: Object }],
    favTourstPlaces: [
      { type: mongoose.Schema.Types.ObjectId, ref: "TouristPlaces" },
    ],
    favGardens: [{ type: mongoose.Schema.Types.ObjectId, ref: "GardenPlace" }],
    favTourstPlaces: [
      { type: mongoose.Schema.Types.ObjectId, ref: "TouristPlaces" },
    ],
  },
  newsletter: { type: Boolean, default: false },
  role: {
    type: String,
    enum: ["admin", "user", "superadmin"],
    default: "user",
  },
  hashpass: String,
});

const User = mongoose.model("User", userSchema);

module.exports = User;
