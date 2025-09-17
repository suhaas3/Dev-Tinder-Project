const express = require('express');
const { userAuth } = require('../middlewares/auth');
const ConnectionRequest = require('../models/connection');
const User = require('../models/user');
const requestRouter = express.Router();


requestRouter.post('/send/request/:status/:toUserId', userAuth, async (req, res) => {
  try {
    const fromUserId = req.user._id;
    const toUserId = req.params.toUserId;
    const status = req.params.status;

    const allowedStatus = ["ignored", "interested"];
    if(!allowedStatus.includes(status)){
      throw new Error("Invalid status type...");
    }

    const existingConnetionRequests = await ConnectionRequest.findOne({
      $or: [
        {fromUserId, toUserId},
        {fromUserId: toUserId, toUserId: fromUserId}
      ]
    })
    if (existingConnetionRequests) {
      throw new Error("Connetion Request is Already exists...");
    }

    const toUser = await User.findById(toUserId);
    if(!toUser) {
      return res.status(400).json({message:"user not found..."});
    }

    const connectionRequest = await ConnectionRequest({
      fromUserId,
      toUserId,
      status
    })
    const data = await connectionRequest.save();

    res.json({
      data
    })
  } catch(err) {
    res.status(400).send("ERROR: "+err.message);
  }
})

module.exports = requestRouter;


