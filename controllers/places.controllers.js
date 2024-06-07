const Place = require("../models/Places.model");
const GardenPlaces = require("../models/GardenPlaces.model");
const TouristPlaces = require("../models/TouristPlaces.model");

const getPlaces = async (req, res) => {
  try {
    // Récupérer tous les lieux
    const places = await Place.find();
    const gardenPlaces = await GardenPlaces.find();
    const touristPlaces = await TouristPlaces.find();

    res.json({
      places,
      gardenPlaces,
      touristPlaces,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateRating = async (req, res) => {
  const { placeId, newRate } = req.body;
  const user = req.user;

  try {
    const place = await Place.findById(placeId);
    if (!place) {
      return res.status(400).json("Place not found");
    }
    if (place.properties.ratedBy.includes(user._id)) {
      return res.status(400).json({ message: "User already rate this place" });
    }

    const rateSum = parseFloat(place.properties.rateSum) + parseFloat(newRate);
    const rateCount = place.properties.rateCount + 1;
    const newAverage = rateSum / rateCount;

    place.properties.rateSum = rateSum;
    place.properties.rateCount = rateCount;
    place.properties.rate = newAverage;

    place.properties.ratedBy.push(user._id);

    await place.save();
    const places = await Place.find();
    console.log("Rating updated successfully.");
    res.status(201).json({ places });
  } catch (error) {
    console.error("Error updating rating:", error);
  }
};

const addPlaces = async (req, res) => {
  try {
    const {
      title,
      picture,
      address,
      category,
      socialNetwork,
      website,
      description,
      coordinates,
    } = req.body;

    // Validation des données
    if (
      !title ||
      !picture ||
      !address ||
      !category ||
      !socialNetwork ||
      !website ||
      !description ||
      !coordinates
    ) {
      return res.status(400).json({
        message: "Veuillez fournir toutes les informations nécessaires.",
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
};

module.exports = { updateRating, addPlaces, getPlaces };
