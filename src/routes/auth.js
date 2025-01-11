const express = require('express');
const authRouter = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const validator = require("validator");

authRouter.post("/signup", async (req, res) => {
    try {
      const { firstName, lastName, emailId, password } = req.body;
      const hashPassword = await bcrypt.hash(password, 10);
      const user = new User({
        firstName,
        lastName,
        emailId,
        password: hashPassword,
      });
      if (!validator.isEmail(user.emailId)) {
        throw new Error("Invalid email");
      }
      await user.save();
      res.send("user created successfully");
    } catch (error) {
      res.status(400).send("user not created: " + error.message);
    }
  });

  authRouter.post("/login", async (req, res) => {
    try {
      const { emailId, password } = req.body;
      const user = await User.findOne({ emailId: emailId });
      if (!user) {
        throw new Error("User not found");
      }
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (isPasswordValid) {
        const token = await user.getJWT();
        res.cookie("token", token, {
          expires: new Date(Date.now() + 60 * 60 * 1000)  // 1 hour
        });
        
      } else {
        throw new Error("Please Login");
      }
      // if(!isPasswordValid){
      //   throw new Error("Invalid Credentials");
      // }
      res.send("Login successful");
    } catch (error) {
      res.send(error.message);
    }
  });

  authRouter.post('/logout', async(req,res) =>{
    res.cookie("token",null, {expires: new Date(Date.now())});
    res.send("Logged out");
  })



module.exports = authRouter;