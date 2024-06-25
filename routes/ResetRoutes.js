const express = require("express");
const resetRouter = express.Router();
const geoPlaces = require("../data/places.json");
const gardenPlaces = require("../data/garden-places.geo.json");
const touristPlaces = require("../data/tourist-places.geo.json");
const adminUsers = require("../data/users.json");
const Place = require("../models/Places.model");
const GardenPlace = require("../models/GardenPlaces.model");
const TouristPlace = require("../models/TouristPlaces.model");
const User = require("../models/Users.model");
const { hashPassword } = require("../utils/hashpass");
const { faker } = require("@faker-js/faker");

resetRouter.post(`/reset/places/${process.env.RESET_KEY}`, async (req, res) => {
  try {
    // Supprimer tous les lieux existants
    await Place.deleteMany({});

    // Créer tous les lieux par lot
    const newGeoPlaces = geoPlaces.map(geoPlace => ({
      geometry: {
        type: geoPlace.geometry.type,
        coordinates: geoPlace.geometry.coordinates,
      },
      properties: {
        name: geoPlace.properties.name,
        picture: geoPlace.properties.picture,
        address: geoPlace.properties.address,
        category: geoPlace.properties.category,
        social_network: geoPlace.properties.social_network,
        website: geoPlace.properties.website,
        description: geoPlace.properties.description,
      },
    }));

    // Insérer en lot le documents
    await Place.insertMany(newGeoPlaces);

    // réponse avec le nombre de lieux créés
    res.status(201).json({
      message: `All places created. Count: ${newGeoPlaces.length}`,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

resetRouter.post(
  `/reset/garden-places/${process.env.RESET_KEY}`,
  async (req, res) => {
    try {
      await GardenPlace.deleteMany({});

      const newGardenPlaces = gardenPlaces.map(gardenPlace => ({
        geometry: {
          type: gardenPlace.geometry.type,
          coordinates: gardenPlace.geometry.coordinates,
        },
        properties: {
          name: gardenPlace.properties.name,
          picture: gardenPlace.properties.picture,
          address: gardenPlace.properties.address,
          category: gardenPlace.properties.category,
          social_network: gardenPlace.properties.social_network,
          website: gardenPlace.properties.website,
          description: gardenPlace.properties.description,
        },
      }));

      await GardenPlace.insertMany(newGardenPlaces);

      res.status(201).json({
        message: `All garden places created. Count: ${newGardenPlaces.length}`,
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
);

resetRouter.post(
  `/reset/tourist-places/${process.env.RESET_KEY}`,
  async (req, res) => {
    try {
      await TouristPlace.deleteMany({});

      const newTouristPlaces = touristPlaces.map(touristPlace => ({
        geometry: {
          type: touristPlace.geometry.type,
          coordinates: touristPlace.geometry.coordinates,
        },
        properties: {
          name: touristPlace.properties.name,
          picture: touristPlace.properties.picture,
          address: touristPlace.properties.address,
          category: touristPlace.properties.category,
          social_network: touristPlace.properties.social_network,
          website: touristPlace.properties.website,
          description: touristPlace.properties.description,
        },
      }));

      await TouristPlace.insertMany(newTouristPlaces);

      res.status(201).json({
        message: `All tourist places created. Count: ${newTouristPlaces.length}`,
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
);

resetRouter.post(`/reset/users/${process.env.RESET_KEY}`, async (req, res) => {
  try {
    const users = await User.find();
    if (users.length >= 5) {
      await User.deleteMany({});
      for (let i = 0; i < 5; i++) {
        const newUser = new User({
          email: faker.internet.email().toLowerCase(),
          account: {
            username: faker.internet.userName(),
            avatar: faker.image.avatar(),
          },
          hashpass: faker.internet.password(),
        });
        await newUser.save();
      }
      for (let j = 0; j < adminUsers.length; j++) {
        const hashPass = await hashPassword(process.env.ADMIN_PASS);
        const newUser = new User({
          email: adminUsers[j].email,
          account: {
            username: adminUsers[j].account.username,
            avatar: faker.image.avatar(),
          },
          role: "superadmin",
          hashpass: hashPass,
        });
        await newUser.save();
      }
      res.status(201).json({
        message: `All users created. Count: ${(await User.find()).length}`,
      });
    } else {
      res.status(400).json({
        message: "Not enough users to reset",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

module.exports = resetRouter;
