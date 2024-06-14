const Place = require("../models/Places.model");
const GardenPlaces = require("../models/GardenPlaces.model");
const TouristPlaces = require("../models/TouristPlaces.model");

// Récupère et renvoie tous les types de lieux de la base de données.
const getPlaces = async (req, res) => {
  try {
    // Récupérer chaque type de lieux séparément
    const places = await Place.find();
    const gardenPlaces = await GardenPlaces.find();
    const touristPlaces = await TouristPlaces.find();
    // Récupère et renvoie tous les types de lieux de la base de données.
    res.json({
      places,
      gardenPlaces,
      touristPlaces,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Met à jour la note d'un lieu en vérifiant que l'utilisateur n'a pas déjà voté.
const updateRating = async (req, res) => {
  const { placeId, newRate } = req.body;
  const user = req.user;

  try {
    // Rechercher le lieu par ID
    const place = await Place.findById(placeId);
    if (!place) {
      return res.status(400).json("Place not found");
    }

    // Vérifier si l'utilisateur a déjà noté le lieu
    if (place.properties.ratedBy.includes(user._id)) {
      return res.status(400).json({ message: "User already rate this place" });
    }

    // Mettre à jour les propriétés de notation du lieu
    const rateSum = parseFloat(place.properties.rateSum) + parseFloat(newRate);
    const rateCount = place.properties.rateCount + 1;
    const newAverage = rateSum / rateCount;

    place.properties.rateSum = rateSum;
    place.properties.rateCount = rateCount;
    place.properties.rate = newAverage;

    place.properties.ratedBy.push(user._id);

    await place.save();

    res.status(201).json({ message: "Rating updated successfully." });
  } catch (error) {
    console.error("Error updating rating:", error);
  }
};

// Traite l'ajout ou la mise à jour d'un avis sur un lieu.
const updateReview = async (req, res) => {
  const { placeId, isPositive } = req.body;
  const user = req.user;

  try {
    const place = await Place.findById(placeId);
    if (!place) {
      return res.status(404).send("Lieu non trouvé");
    }

    // Déterminer les champs concernés en fonction du type d'avis
    const positiveField = "positiveReviewedBy";
    const negativeField = "negativeReviewedBy";
    const currentField = isPositive ? positiveField : negativeField;
    const oppositeField = isPositive ? negativeField : positiveField;
    const currentCountField = isPositive ? "positiveReview" : "negativeReview";
    const oppositeCountField = isPositive ? "negativeReview" : "positiveReview";

    // Vérifier si l'utilisateur a déjà voté dans le sens actuel et Eepêche les votes multiples dans le même sens
    if (place.properties[currentField].includes(user._id)) {
      return res
        .status(400)
        .json({ message: "Vous avez déjà voté de cette manière" });
    }

    let isNewVote = false;

    // Gérer le changement de vote et mise à jour des compteurs
    if (place.properties[oppositeField].includes(user._id)) {
      place.properties[oppositeField] = place.properties[oppositeField].filter(
        id => id.toString() !== user._id.toString()
      );
      place.properties[oppositeCountField]--;
    } else {
      isNewVote = true; // Si l'utilisateur n'était pas dans le champ opposé, c'est un nouveau vote
    }

    // Ajouter le vote
    place.properties[currentField].push(user._id);
    place.properties[currentCountField]++;

    if (isNewVote) {
      // Incrémenter le reviewCount seulement si c'est un nouveau vote
      place.properties.reviewCount++;
    }

    // Recalculer les pourcentages de reviews positives et négatives
    if (place.properties.reviewCount > 0) {
      place.properties.positivePercentage =
        (place.properties.positiveReview / place.properties.reviewCount) * 100;
      place.properties.negativePercentage =
        (place.properties.negativeReview / place.properties.reviewCount) * 100;
    }

    await place.save();
    return res
      .status(200)
      .json({ message: "Review ajoutée ou mise à jour avec succès" });
  } catch (error) {
    console.error(
      "Erreur lors de l'ajout ou de la mise à jour de la review :",
      error
    );
    return res
      .status(500)
      .send("Erreur lors de l'ajout ou de la mise à jour du vote");
  }
};

// Ajoute un nouveau lieu dans la base de données après validation des données requises.
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

    // Créer et sauvegarder le nouveau lieu
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
