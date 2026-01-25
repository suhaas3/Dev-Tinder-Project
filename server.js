// // Import the express module
// require("dotenv").config();
// const express = require('express');
// const connectDb = require('./src/config/database');
// const User = require("./src/models/user");
// const { validateSignUpData } = require("./src/Utils/validation");
// const bcrypt = require('bcrypt');
// const cookieParser = require('cookie-parser');
// const jwt = require("jsonwebtoken");
// const { userAuth } = require('./src/middlewares/auth');
// const authRouter = require('./src/routes/auth');
// const profileRouter = require('./src/routes/profile');
// const requestRouter = require('./src/routes/request');
// const userRouter = require('./src/routes/user');
// const cors = require('cors');

// // Create an express app
// const app = express();
// // Define a port
// const PORT = process.env.PORT || 3333;

// //convert all the json data into javaScript object
// app.use(express.json())
// app.use(cookieParser());
// app.use(cors({
//   origin: "http://localhost:5173",
//   credentials: true
// }));

// app.use('/', authRouter);
// app.use('/', profileRouter);
// app.use('/', requestRouter);
// app.use('/', userRouter);


// // Start the server
// connectDb()
//   .then(() => {
//     app.listen(PORT, () => {
//       console.log(`Server is listening at http://localhost:${PORT}`);
//     });
//     console.log("Database is Connected successfully...");
//   })
//   .catch((err) => {
//     console.log("Connection Error:", err.message);
//   })

require("dotenv").config();

const express = require("express");
const connectDb = require("./src/config/database");

const authRouter = require("./src/routes/auth");
const profileRouter = require("./src/routes/profile");
const requestRouter = require("./src/routes/request");
const userRouter = require("./src/routes/user");

const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3333;

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

connectDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ DB Connection Error:", err.message);
  });

