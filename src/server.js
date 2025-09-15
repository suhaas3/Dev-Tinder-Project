// Import the express module
const express = require('express');
const { connectDb } = require('./config/database');
const User = require("./models/user");
const { validateSignUpData } = require("./Utils/validation");
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const jwt = require("jsonwebtoken");
const { userAuth } = require('./middlewares/auth');
const authRouter = require('./routes/auth');

// Create an express app
const app = express();
// Define a port
const PORT = 3333;

//convert all the json data into javaScript object
app.use(express.json())
app.use(cookieParser());

app.use('/', authRouter);

//GET user by email
app.get('/userProfile', userAuth, async (req, res) => {

  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
})

app.post("/sendConnectionRequest", userAuth, async (req,res,next) => {
  const {user} = req;
  res.send(user.firstName + "  send connection request...");
})
//GET all users in database
app.get("/feedUser", async (req, res) => {
  try {
    const allUsers = await User.find({});
    res.send(allUsers)
  } catch (err) {
    res.status(400).send("Not users in database:" + err.message);
  }
})

//delete the user that is FindByIdAndDelete
app.delete('/user', async (req, res) => {
  const userId = req.body;
  try {
    const deleteUser = await User.findOneAndDelete(userId);
    res.send("user Deleted:" + deleteUser);
  } catch (err) {
    res.status(400).send("Something went wrong:" + err.message);
  }
})


app.patch('/updateUser', async (req, res) => {
  const data = req.body;
  const { userId } = req.body;
  // const { emailId } = req.body;
  // console.log(data, 'user id');

  try {
    const ALLOWED_UPDATES = ["userId", "about", "age", "gender", "skills", "lastName"]

    const isUpdateAllowed = Object.keys(data).every((k) =>
      ALLOWED_UPDATES.includes(k)
    )

    if (!isUpdateAllowed) {
      throw new Error("Update not allowed");
    }
    //update user by ID
    // const updateUser = await User.findByIdAndUpdate(userId, data, {
    //   returnDocument: 'after'
    // })
    // res.send(updateUser)

    //update user by email
    const updateUserByEmail = await User.findByIdAndUpdate(userId, data, {
      returnDocument: 'after',
      runValidators: true
    });
    res.send(updateUserByEmail)

  } catch (err) {
    res.status(400).send("something went wrong :" + err.message)
  }
})




// Start the server
connectDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is listening at http://localhost:${PORT}`);
    });
    console.log("Database is Connected successfully...");
  })
  .catch((err) => {
    console.log("Connection Error:", err.message);
  })
