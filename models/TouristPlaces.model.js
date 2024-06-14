const mongoose = require("mongoose");

const TouristPlaceSchema = new mongoose.Schema({
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
    review: {
      positiveReviewedBy: [
        { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      ],
      negativeReviewedBy: [
        { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      ],
      positiveReview: { type: Number, default: 0 },
      negativeReview: { type: Number, default: 0 },
      reviewCount: { type: Number, default: 0 },
      positivePercentage: { type: Number, default: 0 },
      negativePercentage: { type: Number, default: 0 },
    },
  },
});

const TouristPlace = mongoose.model("TouristPlace", TouristPlaceSchema);

module.exports = TouristPlace;
