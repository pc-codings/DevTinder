const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middleware/auth");
const User = require("../models/user");
const validateEditProfileData = require("../utils/validation");

profileRouter.get("/profile", userAuth, async function (req, res) {
  try {
    const user = req.user;
    res.send(user);
  } catch (error) {
    res.status(400).send("Please Login");
  }
});

profileRouter.patch("/profile/edit", userAuth, async function (req, res) {
  try {
    if (!validateEditProfileData(req)) {
      throw new Error("Invalid Edit Request");
    }
    const loggenInUser = req.user;
    Object.keys(req.body).forEach((key) => (loggenInUser[key] = req.body[key]));
    await loggenInUser.save();
    res.send("User Updated Successfully");
  } catch (error) {
    res.status(400).send("Invalid Edit Request");
  }
});

module.exports = profileRouter;
