const express = require('express');
const { userAuth } = require('../middlewares/auth');
const ConnectionRequest = require('../models/connection');
const userRouter = express.Router();

const user_safe_data = "firstName lastName age gender skills photoUrl about";

//GET all the pending connection requset for the loggedUn user
userRouter.get('/user/requests/received', userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequests = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested"
    }).populate("fromUserId", user_safe_data)

    res.json({
      message: "Data fetched successfully...",
      data: connectionRequests
    })

  } catch (err) {
    res.status(400).send("ERROR :"+err.message);
  }
})


module.exports = userRouter;