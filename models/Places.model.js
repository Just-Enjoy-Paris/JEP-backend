const mongoose = require("mongoose");

const placeSchema = new mongoose.Schema({
  geometry: {
    type: {
      type: String,
      enum: ["Point"],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  properties: {
    name: { type: String, required: true },
    picture: { type: String, required: true },
    address: { type: String, required: true },
    category: { type: [String], required: true },
    social_network: [Object],
    website: String,
    description: { type: String, required: true },
    rate: { type: Number, default: 0 },
    rateCount: { type: Number, default: 0 },
    rateSum: { type: Number, default: 0 },
  },
});

const Place = mongoose.model("Place", placeSchema);

module.exports = Place;
