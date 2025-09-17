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
const profileRouter = require('./routes/profile');
const requestRouter = require('./routes/request');

// Create an express app
const app = express();
// Define a port
const PORT = 3333;

//convert all the json data into javaScript object
app.use(express.json())
app.use(cookieParser());

app.use('/', authRouter);
app.use('/', profileRouter);
app.use('/', requestRouter);




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
