const express = require('express');
const { userAuth } = require('../middlewares/auth');
const ConnectionRequest = require('../models/connection');
const User = require('../models/user');
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


userRouter.get('/user/connections', userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequests = await ConnectionRequest.find({
      $or: [
        {toUserId: loggedInUser._id, status: "accepted"},
        {fromUserId: loggedInUser._id, status: "accepted"}
      ]
    }).populate("fromUserId", user_safe_data)
      .populate("toUserId", user_safe_data);

      const data = connectionRequests.map(row => {
        if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
          return row.toUserId;
        }
        return row.fromUserId
      })


    res.json({data});
  } catch (err) {
    res.status(400).send("ERROR :"+err.message);
  }
})

userRouter.get('/user/feed', userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequests = await ConnectionRequest.find({
      $or: [
        {fromUserId: loggedInUser._id},
        {toUserId: loggedInUser._id}
      ]
    })
      .select("fromUserId toUserId")
      // .populate("fromUserId", user_safe_data)
      // .populate("toUserId", user_safe_data);

      const hideUsersFromFeed = new Set();

      connectionRequests.forEach((req) => {
        hideUsersFromFeed.add(req.fromUserId.toString());
        hideUsersFromFeed.add(req.toUserId.toString());
      })

      const users = await User.find({
        $and: [
          {_id: {$nin: Array.from(hideUsersFromFeed)}},
          {_id: {$ne: loggedInUser._id}}
        ]
      }).select(user_safe_data);
    
    res.json({data: users})
  } catch (err) {
    res.status(400).send("ERROR :"+err.message);
  }
})

module.exports = userRouter;