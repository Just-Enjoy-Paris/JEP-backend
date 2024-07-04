const mongoose = require("mongoose");

const placeSchema = new mongoose.Schema({
  geometry: {
    type: {
      type: Array,
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
    picture: { type: String, required: true },
    address: { type: String, required: true },
    category: { type: [String], required: true },
    social_network: [Object],
    website: String,
    description: { type: String, required: true },
    rate: { type: Number, default: 0 },
    rateCount: { type: Number, default: 0 },
    rateSum: { type: Number, default: 0 },
    ratedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    positiveReviewedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    negativeReviewedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    positiveReview: { type: Number, default: 0 },
    negativeReview: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    positivePercentage: { type: Number, default: 0 },
    negativePercentage: { type: Number, default: 0 },
  },
  id_JEP: { type: String, required: true },
});

const Place = mongoose.model("Place", placeSchema);

module.exports = Place;
