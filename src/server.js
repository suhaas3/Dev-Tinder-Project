// Import the express module
const express = require('express');
const { connectDb } = require('./config/database');
const User = require("./models/user");
const { validateSignUpData } = require("./Utils/validation");
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const jwt = require("jsonwebtoken");
const { userAuth } = require('./middlewares/auth');

// Create an express app
const app = express();
// Define a port
const PORT = 3333;

//convert all the json data into javaScript object
app.use(express.json())
app.use(cookieParser());

app.post("/signup", async (req, res) => {

  try {
    //validation of data
    validateSignUpData(req);
    const { firstName, lastName, emailId, password, skills } = req.body;

    //encrypt the password
    const passwordHash = await bcrypt.hash(password, 4);
    // console.log(passwordHash);

    const user = new User({
      firstName, lastName, emailId, password: passwordHash, skills
    });
    //create a new instance of the user
    // const user = new User({
    //   firstName: "arya",
    //   lastName: "sourya",
    //   emailId: "arya@gmail.com",
    //   password: "aryalove-com",
    //   age: 25,
    //   gender: "male"
    // })

    await user.save();
    res.send("user signup successfully!");
  } catch (err) {
    res.status(400).send("Bad request:" + err.message);
  }
})

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

app.post('/login', async (req, res) => {
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
      res.send("Login successful");
    } else {
      throw new Error("Password incorrect")
    }
  } catch (err) {
    res.status(400).send("Invalid credentials");
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
