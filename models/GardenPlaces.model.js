const mongoose = require("mongoose");

const GardenPlaceSchema = new mongoose.Schema({
  geometry: {
    type: {
      type: String,
      default: ["Point"],
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
    ratedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    posiveReview: { type: Number, default: 0 },
    negativeReview: { type: Number, default: 0 },
    reviewedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
});

const GardenPlace = mongoose.model("GardenPlace", GardenPlaceSchema);

module.exports = GardenPlace;
