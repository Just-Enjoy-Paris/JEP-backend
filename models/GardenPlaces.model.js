const mongoose = require("mongoose");

const GardenPlaceSchema = new mongoose.Schema({
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
    picture: String,
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

const GardenPlace = mongoose.model("GardenPlace", GardenPlaceSchema);

module.exports = GardenPlace;
