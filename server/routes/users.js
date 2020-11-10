var express = require('express');
var router = express.Router();

//Importing library for hashing user info.
const bcrypt = require('bcryptjs');

//Importing library for auth tokens.
const jsonwebtoken = require('jsonwebtoken');

//Importing the api endpoints.
const validateRegistration = require('./api/register');
const validateLogin = require('./api/login');

//Importing environment variables from .env
require('dotenv').config();
const envVars = process.env;
const { MONGO_URI, PORT } = envVars;

//Importing our definition of a user for the mongo db.
const User = require('../db_schema/UserDefinition');


router.post('/register', (req, res) => {

	const {errors, valid} = validateRegistration(req.body);

	//If the registration input is not valid return an error code with the specific errors present.
	if(!valid) {
		return res.status(400).json(errors);
	}

	//Checking the database to see if the primary key (the email) is already present.
	//Query documentation https://mongoosejs.com/docs/api/query.html#query_Query
	//findOne() documentation - https://mongoosejs.com/docs/api/query.html#query_Query-findOne
	//findOne() returns a mongoose "Query" which is a "promise-like" object. This allows us to use .then even though findOne() doesnt return a fully-fledged promise. https://stackoverflow.com/questions/35662210/does-mongoose-findone-on-model-return-a-promise
	/*
	User.findOne({email: req.body.email}).then(user => {
		if(user exists){
			return an error
		}	
		else {
			create a new user based on UserDefinition
		}
	});
	*/
	
	/*
	var saltRounds = 10;
	//This is kind of confusing but the function accepting (err, salt) is a callback that only gets fired after the salt has been generated. https://www.npmjs.com/package/bcrypt
	bcrypt.genSalt(saltRounds, (err, salt) => {
		bcrypt.hash(users password, salt, (err, hash) => {
			set the hash to the pass
			save the user to the db
		});
	});
	*/

});

router.post('/login', (req, res) => {

	const {errors, valid} = validateLogin(req.body);

	//If the registration input is not valid return an error code with the specific errors present.
	if(!valid) {
		return res.status(400).json(errors);
	}

	User.findOne({email: req.body.email}).then( user => {
		if(!user) {
			return res.status(404).json({badEmail: "Invalid Email Address Entered."});
		}


		/*

			bcrypt.compare(req.body.password, user.password).then(isMatch => {
				if(match) {
					start creating tokens
				}
			});

		*/

	});


});

/* GET users listing. */
router.get('/', function(req, res, next) {
	res.send('respond with a resource');
});

module.exports = router;
