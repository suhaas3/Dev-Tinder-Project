const express = require("express");
const { userAuth } = require("../middlewares/auth");
const { validateEditData } = require("../Utils/validation");
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

profileRouter.patch('/profile/edit', userAuth, async (req, res) => {

  try {

    if (!validateEditData(req)) {
      throw new Error("Not allow to update profile...");
    }

    const loggedInUser = req.user;

    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]))

    await loggedInUser.save();
    
    res.send(`${loggedInUser.firstName} , profile updated successfully...`)

  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }

})


module.exports = profileRouter;