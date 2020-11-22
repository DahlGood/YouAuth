//Actually importing the express server.
const express = require("express");

//For connection to the mongo database.
const mongoose = require("mongoose");

//For parsing user entered data like email and password.
const bodyParser = require("body-parser");

//Adding our passport information.
const passport = require("passport");

//Importing our api-endpoints
const users = require("./routes/users");

//Setting environment variable config.
require("dotenv").config();

//Getting environment variables from .env in /server
const envVars = process.env;
const { MONGO_URI, PORT } = envVars;

//Setting up server.
const server = express();

//Setting up the body parser middleware
server.use(
  bodyParser.urlencoded({
    extended: false,
  })
);

server.use(bodyParser.json());

//Setting up DB connections.
const db = MONGO_URI;

//Connect to DB.
mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => console.log("MongoDB Connection Successful!"))
  .catch((err) => console.log(err));

//Passport stuff
server.use(passport.initialize());

require("./config/passport")(passport);


const cors = require("cors");

server.use(cors());

//Routes
server.use("/users", users);

server.listen(envVars.PORT, () => {
  console.log("Server running on port: " + envVars.PORT);
});
