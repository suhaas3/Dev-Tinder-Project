// Import the express module
const express = require('express');
const { adminAuth, userAuth } = require("./middlewares/auth")
const { connectDb } = require('./config/database');
const User = require("./models/user");
const { validateSignUpData } = require("./Utils/validation");
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const jwt = require("jsonwebtoken");

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
app.get('/userProfile', async (req, res) => {

  try {
    const cookies = req.cookies;

    const { token } = cookies;

    if (!token) {
      throw new Error("Invalid token")
    }

    // verify a token symmetric - synchronous
    const decodedMessage = await jwt.verify(token, "DEV@Tinder$790");

    const { _id } = decodedMessage;

    const { emailId } = req.query;

    const user = await User.findById(_id);
    res.send(user)
    
    if (!user) {
      throw new Error("user does not exist");
    }
  } catch (err) {
    res.status(400).send("User Not Found:" + err.message);
  }
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

    const isPasswordValid = await bcrypt.compare(password, user.password);

    console.log(user._id);

    if (isPasswordValid) {
      //create a JWT token


      const token = await jwt.sign({ _id: user._id }, "DEV@Tinder$790");

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


/*
app.use("/", (err, req, res, next) => {
  if (err) {
    res.status(404).send("unexpected server error");
  }
})

app.use("/user", (req, res, next) => {
  try {
    throw new Error("errorrrrrrrrrr");
    res.send("user data fetched");
  } catch (err) {
    next(err); //pass this error to Express error handler
  }
})

app.use("/", (err, req, res, next) => {
  if (err) {
    res.status(404).send("unexpected server error");
  }
})
  */


/*
app.use('/admin', adminAuth)
 
app.use("/user", userAuth)
 
app.get("/admin/getUserData", (req, res) => {
  res.send("All user Data")
})
 
app.get("/admin/deleteUser", (req, res) => {
  res.send("Deleted user successfully!");
})
 
app.get("/user/login", (req, res) => {
  res.send("user Data Fetched succesfully!");
})
*/

/*
app.use('/user',
  [(req, res, next) => {
    console.log('Handle route -1')
    // res.send("1st route handler!");
    next();
  },
 
  (req, res, next) => {
    console.log('handle route -2');
    // res.send("2nd route handler!");
    next();
  }],
 
  (req, res, next) => {
    console.log("handle route -3");
    // res.send("3rd route handler!");
    next();
  },
 
  (req, res, next) => {
    console.log("handle route -4");
    // res.send("4th route handler!");
    next();
  },
 
   (req, res, next) => {
    console.log("handle route -5");
    res.send("5th route handler!");
  }
)
*/


/*
 
//if don't write the 'b' it will work
app.get('/ab?cd',(req,res) => {
  console.log(res.query)
  res.send({firstname:"sai suhaas",lastname:"jatangi"});
})
 
//first letter is 'a' and then last letter is 'b' remaining any thing we write it will work
app.get('/a*b',(req,res) => {
  res.send({first:"sai",last:"suhaas"})
})
 
app.get('/a(bd)+c',(req,res) => {
  res.send({first:"jatangi",last:"sai suhaas"})
})
 
app.get('/user/:userId/:userName/:password',(req,res) => {
  console.log(req.params)
  res.send({firstname:'hardik',lastname:'pandya'})
})
//this will only handle  GET call to /test
app.get('/test',(req,res) => {
  res.send('tested data here there!');
})
 
 
app.post('/hello', async (req,res) => {
  console.log(req.body,'req body');
  //saving data to DB
  res.send("data posted succesfully!");
})
 
app.delete('/remove',(req,res) => {
  res.send("deleted data succesfully!");
})
 
//this will match all the HTTP method API calls to /test
app.use('/test',(req,res) => {
  res.send("data get from the Test!");
})
 
*/

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
