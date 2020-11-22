var express = require("express");
var router = express.Router();

//Importing library for hashing user info.
const bcrypt = require("bcryptjs");

//Importing library for auth tokens.
const jsonwebtoken = require("jsonwebtoken");

//Importing the api endpoints.
const validateRegistration = require("./api/register");
const validateLogin = require("./api/login");

//Importing environment variables from .env
require("dotenv").config();
const envVars = process.env;
const { MONGO_URI, PORT, SECRET_KEY } = envVars;

//Importing our definition of a user for the mongo db.
const User = require("../db_schema/UserDefinition");

//JWT Auth stuff
const { ExtractJwt } = require("passport-jwt");

const bodyParser = require("body-parser");
let jsonParser = bodyParser.json();

router.post("/register", jsonParser, (req, res) => {

	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Content-Type', 'application/json');

	const { errors, notValid } = validateRegistration(req.body);

	//If the registration input is not valid return an error code with the specific errors present.
	if (notValid) {
		return res.status(400).json(errors);
	}

	//Checking the database to see if the primary key (the email) is already present.
	//Query documentation https://mongoosejs.com/docs/api/query.html#query_Query
	//findOne() documentation - https://mongoosejs.com/docs/api/query.html#query_Query-findOne
	//findOne() returns a mongoose "Query" which is a "promise-like" object. This allows us to use .then even though findOne() doesnt return a fully-fledged promise. https://stackoverflow.com/questions/35662210/does-mongoose-findone-on-model-return-a-promise
	User.findOne({ email: req.body.email }).then((user) => {
		//If the user exists.
		if (user) {
			return res
				.status(400)
				.json({ email: "A user with that Email already exists." });
		} else {
			const newUser = new User({
				fName: req.body.fName,
				lName: req.body.lName,
				email: req.body.email,
				password: req.body.password,
			});

			//Look up salt rounds. This is just an excuse for a git compare
			var saltRounds = 10;
			//This is kind of confusing but the function accepting (err, salt) is a callback that only gets fired after the salt has been generated. https://www.npmjs.com/package/bcrypt
			bcrypt.genSalt(saltRounds, (err, salt) => {
				bcrypt.hash(newUser.password, salt, (err, hash) => {
					if (err) {
						throw err;
					}
					newUser.password = hash;
					newUser
						.save()
						.then((user) => res.json(user))
						.catch((err) => console.log(err));
				});
			});
		}
	});
	return res.status(200);
});

router.post("/login", jsonParser, (req, res) => {

	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Content-Type', 'application/json');

	const { errors, notValid } = validateLogin(req.body);

	//If the registration input is not valid return an error code with the specific errors present.
	if (notValid) {
		return res.status(400).json(errors);
	}

	//Getting email and password the user entered from the request.
	const email = req.body.email;
	const password = req.body.password;

	//Searching db to see if a user with that email exists.
	User.findOne({ email }).then((user) => {
		if (!user) {
			return res
				.status(401)
				.json({ badEmail: "Invalid Email Address Entered." });
		}

		//Hashes entered password and compares it with the one in the db.
		bcrypt.compare(password, user.password).then((match) => {
			//If the password matches generate a payload of user id and password (what does the payload do? research more jwt stuff.)
			if (match) {
				const payload = {
					id: user.id,
					email: user.email,
				};

				//Sign the token with the payload, secret key, and expiration time.
				jsonwebtoken.sign(
					payload,
					SECRET_KEY,
					{ expiresIn: 31556926 },
					(err, token) => {
						res.json({
							success: true,
							token: "Bearer " + token,
						});
					}
				);
			} else {
				return res.status(400).json({ passCorrectness: "Invalid password entered." });
			}
		});
	});

	return res.status(200);
});

/* GET users listing. */
router.get("/", function (req, res, next) {
	var x = app._router.stack;
	console.log(x);
	res.send("respond with a resource");
});

module.exports = router;
