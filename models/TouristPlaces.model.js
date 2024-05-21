const mongoose = require("mongoose");

const TouristPlaceSchema = new mongoose.Schema({
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
    // positive_review: { type: Number, default: 0 },
    // negative_review: { type: Number, default: 0 },
  },
});

const TouristPlace = mongoose.model(
  "TouristPlace",
  TouristPlaceSchema
);

module.exports = TouristPlace;
