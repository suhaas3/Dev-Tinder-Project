// Import the express module
const express = require('express');
const { adminAuth, userAuth } = require("./middlewares/auth")
const { connectDb } = require('./config/database');
const User = require("./models/user");

// Create an express app
const app = express();
// Define a port
const PORT = 3333;

app.post("/signup", async (req, res) => {
  //create a new instance of the user
  const user = new User({
    firstName: "arya",
    lastName: "sourya",
    emailId: "arya@gmail.com",
    password: "aryalove-com",
    age: 25,
    gender: "male"
  })

  await user.save();
  res.send("user signup successfully!");
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
