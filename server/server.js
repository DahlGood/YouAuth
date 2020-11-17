//Actually importing the express server.
const express = require('express');

//For connection to the mongo database.
const mongoose = require('mongoose');

//For parsing user entered data like email and password.
const bodyParser = require('body-parser');

//Setting environment variable config.
require('dotenv').config();

//Getting environment variables from .env in /server
const envVars = process.env;
const { MONGO_URI, PORT } = envVars;


//Setting up server.
const server = express();

//Setting up the body parser middleware 
server.use(
	bodyParser.urlencoded({
		extended: false
	})
);
server.use(bodyParser.json());

/*
	Connect to mongo here
*/

server.listen(envVars.PORT, () => {
	console.log("Server running on port: " + envVars.PORT);
})

