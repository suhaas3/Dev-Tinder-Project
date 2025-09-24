const express = require("express");
const { userAuth } = require("../middlewares/auth");
const { validateEditData, validateEditPassword, validateEmailForPasswordChange } = require("../Utils/validation");
const bcrypt = require('bcrypt');
const profileRouter = express.Router();



//GET user by token and _id
profileRouter.get('/profile/view', userAuth, async (req, res) => {

  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
})

//update the profile
profileRouter.patch('/profile/edit', userAuth, async (req, res) => {

  try {

    if (!validateEditData(req)) {
      throw new Error("Not allow to update profile...");
    }

    const loggedInUser = req.user;

    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]))

    await loggedInUser.save();

    res.json({
      message: `${loggedInUser.firstName} , profile updated successfully...`,
      data: loggedInUser
    })

  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }

})

//change password API
profileRouter.patch('/profile/password', userAuth, async (req, res) => {

  try {

    if (!validateEditPassword(req)) {
      throw new Error("Not able to change the password!")
    }

    const loggedInUser = req.user;
    const { password } = req.body;

    const passwordHash = await bcrypt.hash(password, 10);

    loggedInUser.password = passwordHash;

    await loggedInUser.save();


    res.send("ur able to change password...")
  }
  catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
})

//forget password API
profileRouter.patch('/profile/forgetPassword', userAuth, async (req, res) => {
  try {
    await validateEmailForPasswordChange(req);

    const { password } = req.body;
    const loggedInUser = req.user;

    const passwordHash = await bcrypt.hash(password, 10);

    loggedInUser.password = passwordHash;

    await loggedInUser.save();

    res.send("password updated successfully...");
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
})


module.exports = profileRouter;