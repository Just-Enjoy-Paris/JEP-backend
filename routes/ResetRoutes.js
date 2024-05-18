const express = require("express");
const resetRouter = express.Router();
const geoPlaces = require("../places.json");
const Place = require("../models/Places.model");
const User = require("../models/Users.model");
const bcrypt = require("bcrypt");
const { faker } = require("@faker-js/faker");
const adminUsers = require("../users.json");

resetRouter.post(
  `/reset-places/${process.env.RESET_KEY}`,
  async (req, res) => {
    const places = await Place.find();
    if (places.length <= 75) {
      try {
        await Place.deleteMany({});
        for (let i = 0; i < 74; i++) {
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
          const newUser = new User({
            username: faker.internet.userName(),
            email: faker.internet.email().toLowerCase(),
            account: {
              username: faker.internet.displayName(),
              avatar: faker.image.avatar(),
            },
            hashpass: faker.internet.password(),
          });
          await newUser.save();
        }
        for (let j = 0; j < adminUsers.length; j++) {
          const hashPass = await bcrypt.hash(
            process.env.ADMIN_PASS,
            10
          );
          const newUser = new User({
            username: adminUsers[j].username,
            email: adminUsers[j].email,
            account: {
              username: adminUsers[j].account.username,
              avatar: faker.image.avatar(),
            },
            hashpass: hashPass,
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
  }
);

module.exports = resetRouter;
