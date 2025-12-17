const express = require('express');
const authRouter = express.Router();
const User = require('../models/user');
const { validateSignUpData } = require('../Utils/validation');
const bcrypt = require('bcrypt');




authRouter.post("/signup", async (req, res) => {

  try {
    //validation of data
    validateSignUpData(req);
    const { firstName, lastName, emailId, password } = req.body;

    //encrypt the password
    const passwordHash = await bcrypt.hash(password, 4);
    // console.log(passwordHash);

    const user = new User({
      firstName, lastName, emailId, password: passwordHash
    });

    const savedUser = await user.save();
    const token = await savedUser.getJwt();

    // res.cookie("token", token, {
    //   expires: new Date(Date.now() + 8 * 3600000)
    // })

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",      // ⭐ REQUIRED
      expires: new Date(Date.now() + 8 * 3600000)
    });

    res.json({
      message: "user signup successfully!",
      data: savedUser
    });
  } catch (err) {
    // res.status(400).send("Bad request:" + err.message);
    res.status(400).json({
      message: err.message
    });
  }
})

authRouter.post('/login', async (req, res) => {
  try {
    const { emailId, password } = req.body;

    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Invalid email id")
    }

    // console.log(user,"userdata")

    const isPasswordValid = await user.verifyPassword(password);


    if (isPasswordValid) {
      //create a JWT token


      const token = await user.getJwt();
      //Add the token to cookie and send the response back to the user
      res.cookie("token", token, {
        httpOnly: true,
        secure: false,       // change to true if using HTTPS
        sameSite: "strict"
      });
      // res.send("Login successfully!!");
      res.send(user);
    } else {
      throw new Error("Password incorrect")
    }
  } catch (err) {
    res.status(400).send("Invalid credentials");
  }
})

authRouter.post('/logout', async (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now())
  }).send("logout successfully...");
})


module.exports = authRouter;