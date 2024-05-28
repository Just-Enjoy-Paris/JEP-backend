const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: String,
  account: {
    username: { type: String, required: true },
    avatar: { type: mongoose.Schema.Types.Mixed, default: {} },
    favPlaces: [{ type: Object, default: {} }],
  },
  newsletter: { type: Boolean, default: false },
  hashpass: String,
});

const User = mongoose.model("User", userSchema);

module.exports = User;
