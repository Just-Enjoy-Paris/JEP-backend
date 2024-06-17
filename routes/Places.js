const express = require("express");
const placesRouter = express.Router();
const isAuthenticated = require("../middlewares/isAuth");
const {
  updateRating,
  addPlaces,
  getPlaces,
  updateReview,
} = require("../controllers/places.controllers");

placesRouter.get("/places", (req, res) => {
  getPlaces(req, res);
});

placesRouter.post("/add-places", isAuthenticated, (req, res) => {
  addPlaces(req, res);
});

placesRouter.put("/rating-place", isAuthenticated, (req, res) => {
  updateRating(req, res);
});

placesRouter.put("/update-review", isAuthenticated, (req, res) => {
  updateReview(req, res);
});

module.exports = placesRouter;
