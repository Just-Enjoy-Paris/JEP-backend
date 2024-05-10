const express = require("express");
const placesRouter = express.Router();
const Place = require("../models/Places.model");

placesRouter.post("/add-places", async (req, res) => {
  try {
    const {
      title,
      picture,
      address,
      category,
      socialNetwork,
      website,
      description,
    } = req.body;

    // Validation des données
    if (
      !title ||
      !picture ||
      !address ||
      !category ||
      !socialNetwork ||
      !website ||
      !description
    ) {
      return res.status(400).json({
        message:
          "Veuillez fournir toutes les informations nécessaires.",
      });
    }

    const newPlace = new Place({
      geometry: {
        type: type,
        coordinates: coordinates,
      },
      properties: {
        name: title,
        picture: picture,
        address: address,
        category: category,
        social_network: socialNetwork,
        website: website,
        description: description,
      },
    });

    await newPlace.save();

    res.status(201).json(newPlace);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

placesRouter.get("/allplaces", async (req, res) => {
  try {
    // Récupérer tous les lieux
    const places = await Place.find();

    res.json({ count: places.length, places: places });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = placesRouter;
