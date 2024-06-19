const Place = require("../models/Places.model");
const GardenPlaces = require("../models/GardenPlaces.model");
const TouristPlaces = require("../models/TouristPlaces.model");

// Retrieves and returns all types of places from the database.
const getPlaces = async (req, res) => {
  try {
    // Retrieve each type of places separately
    const places = await Place.find();
    const gardenPlaces = await GardenPlaces.find();
    const touristPlaces = await TouristPlaces.find();
    // Retrieves and returns all types of places from the database.
    res.json({
      places,
      gardenPlaces,
      touristPlaces,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Updates the rating of a place by checking that the user has not already voted.
const updateRating = async (req, res) => {
  const { placeId, newRate } = req.body;
  const user = req.user;

  try {
    // Find the place by ID
    const place = await Place.findById(placeId);
    if (!place) {
      return res.status(400).json("Place not found");
    }

    // Check if the user has already rated the place
    if (place.properties.ratedBy.includes(user._id)) {
      return res.status(400).json({ message: "User already rate this place" });
    }

    // Update the rating properties of the place
    const rateSum = parseFloat(place.properties.rateSum) + parseFloat(newRate);
    const rateCount = place.properties.rateCount + 1;
    const newAverage = rateSum / rateCount;
    const roundedAverage = Math.round(newAverage * 10) / 10;

    place.properties.rateSum = rateSum;
    place.properties.rateCount = rateCount;
    place.properties.rate = roundedAverage;

    place.properties.ratedBy.push(user._id);

    await place.save();

    res.status(201).json({ message: "Rating updated successfully." });
  } catch (error) {
    console.error("Error updating rating:", error);
  }
};

// Handles adding or updating a review on a place.
const updateReview = async (req, res) => {
  const { placeId, isPositive } = req.body;
  const user = req.user;

  try {
    const place = await Place.findById(placeId);
    if (!place) {
      return res.status(404).send("Lieu non trouvé");
    }

    // Determine the fields concerned based on the type of review
    const positiveField = "positiveReviewedBy";
    const negativeField = "negativeReviewedBy";
    const currentField = isPositive ? positiveField : negativeField;
    const oppositeField = isPositive ? negativeField : positiveField;
    const currentCountField = isPositive ? "positiveReview" : "negativeReview";
    const oppositeCountField = isPositive ? "negativeReview" : "positiveReview";

    // Check if the user has already voted in the current direction and prevent multiple votes in the same direction
    if (place.properties[currentField].includes(user._id)) {
      return res
        .status(400)
        .json({ message: "Vous avez déjà voté de cette manière" });
    }

    let isNewVote = false;

    // Handle vote change and update counters
    if (place.properties[oppositeField].includes(user._id)) {
      place.properties[oppositeField] = place.properties[oppositeField].filter(
        id => id.toString() !== user._id.toString()
      );
      place.properties[oppositeCountField]--;
    } else {
      isNewVote = true; // If the user was not in the opposite field, it's a new vote
    }

    // Add the vote
    place.properties[currentField].push(user._id);
    place.properties[currentCountField]++;

    if (isNewVote) {
      // Increment the reviewCount only if it's a new vote
      place.properties.reviewCount++;
    }

    // Recalculate the percentages of positive and negative reviews
    if (place.properties.reviewCount > 0) {
      place.properties.positivePercentage =
        (place.properties.positiveReview / place.properties.reviewCount) * 100;
      place.properties.negativePercentage =
        (place.properties.negativeReview / place.properties.reviewCount) * 100;
    }

    await place.save();
    return res
      .status(200)
      .json({ message: "Review added or updated successfully" });
  } catch (error) {
    console.error("Error adding or updating the review:", error);
    return res.status(500).send("Error adding or updating the vote");
  }
};

// Adds a new place to the database after validating the required data.
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

    // Data validation
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
        message: "Please provide all the necessary information.",
      });
    }

    // Create and save the new place
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

module.exports = { updateRating, addPlaces, getPlaces, updateReview };
