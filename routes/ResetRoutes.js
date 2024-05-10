const express = require("express");
const resetRouter = express.Router();
const geoPlaces = require("../places.json");
const Place = require("../models/Places.model");
const User = require("../models/Users.model");
const bcrypt = require("bcrypt");
const { faker } = require("@faker-js/faker");

resetRouter.post(
  `/reset-places/${process.env.RESET_KEY}`,
  async (req, res) => {
    const places = await Place.find();
    if (places.length >= 5) {
      try {
        await Place.deleteMany({});
        for (let i = 0; i < 10; i++) {
          const newPlace = new Place({
            geometry: {
              type: geoPlaces[i].geometry.type,
              coordinates: geoPlaces[i].geometry.coordinates,
            },
            properties: {
              name: geoPlaces[i].properties.name,
              picture: geoPlaces[i].properties.picture,
              address: geoPlaces[i].properties.address,
              category: geoPlaces[i].properties.category,
              social_network: geoPlaces[i].properties.social_network,
              website: geoPlaces[i].properties.website,
              description: geoPlaces[i].properties.description,
            },
          });
          await newPlace.save();
        }
        res.status(201).json({
          message: `All places created. Count: ${
            (await Place.find()).length
          }`,
        });
      } catch (error) {
        res.status(500).json({
          message: error.message,
        });
      }
    } else {
      res.status(207).json({
        message: "Places already reset",
      });
    }
  }
);

resetRouter.post(
  `/reset-users/${process.env.RESET_KEY}`,
  async (req, res) => {
    const users = await User.find();
    if (users.length >= 5) {
      try {
        await User.deleteMany({});
        for (let i = 0; i < 5; i++) {
          const fakepass = faker.internet.password();
          const hashFakePass = await bcrypt.hash(
            faker.internet.password(),
            15
          );
          const newUser = new User({
            email: faker.internet.email().toLowerCase(),
            account: {
              username: faker.internet.displayName(),
              avatar: faker.image.avatar(),
            },
            hashpass: hashFakePass,
            fakepass: fakepass,
          });
          await newUser.save();
        }
        res.status(201).json({
          message: `all users created count : ${
            (await User.find()).length
          }`,
        });
      } catch (error) {
        res.status(500).json({
          message: error.message,
        });
      }
    } else {
      res.status(207).json({
        message: "Users already reset",
      });
    }
  }
);

module.exports = resetRouter;
