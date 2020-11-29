var express = require("express");
var router = express.Router();

//Importing library for hashing user info.
const bcrypt = require("bcryptjs");

//Importing library for auth tokens.
const jsonwebtoken = require("jsonwebtoken");

//Importing youauth
const youauth = require("youauth");

const zlib = require("zlib");

//Importing the api endpoints.
const validateRegistration = require("./api/register");
const validateLogin = require("./api/login");
const validateFace = require("./api/checkFace");

//Importing environment variables from .env
require("dotenv").config();
const envVars = process.env;
const { MONGO_URI, PORT, SECRET_KEY} = envVars;

//Importing our definition of a user for the mongo db.
const User = require("../db_schema/UserDefinition");

//JWT Auth stuff
const { ExtractJwt } = require("passport-jwt");

const bodyParser = require("body-parser");
const isEmpty = require("is-empty");
let jsonParser = bodyParser.json();

async function load(){
	await youauth.loadModels().then(model => {console.log(model)}).catch(err => {console.log(err)});
}

load();

router.post("/register", jsonParser, (req, res) => {

	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Content-Type', 'application/json');

	const { errors, notValid } = validateRegistration(req.body);

	//If the registration input is not valid return an error code with the specific errors present.
	if (notValid) {
		return res.status(400).json(errors);
	}
	if(req.body.password !== req.body.confirm_password){
		return res
			.status(400)
			.json({ error: "Incorrect passwords entered dumbass" });
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
				.json({ error: "A user with that Email already exists dumbass." });
		} else {
			const newUser = new User({
				fName: req.body.fName,
				lName: req.body.lName,
				email: req.body.email,
				password: req.body.password,
				faceDescriptors: req.body.face
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
	console.log(req.body);
	const { errors, notValid } = validateLogin(req.body);
	//If the registration input is not valid return an error code with the specific errors present.
	if (notValid) {
		return res
		.status(401)
		.json(errors);
	}

	//Getting email and password the user entered from the request.
	const email = req.body.email;
	const face = zlib.inflateSync(Buffer.from(req.body.face, "utf-8")).toString("utf-8");
	const password = req.body.password;
	//Searching db to see if a user with that email exists.
	User.findOne({ email }).then( async (user) => {
		if (!user) {
			return res
				.status(400)
				.json({ error: "Invalid Email Address idiot" });
		}

		const faceRec = new youauth.FaceRecognizer();
		let loadedImage = await faceRec.loadImage(face);
		let detectedResults = await faceRec.detect(loadedImage);
		let labeledFaceDescriptors = faceRec.loadDescriptors(JSON.stringify(user.faceDescriptors));
		let matches = faceRec.getMatches(detectedResults,labeledFaceDescriptors);
		let matchedLabels = faceRec.getMatchedLabels(matches);
		if (isEmpty(matchedLabels)){
			return res
			.status(401)
			.json({ error: "Faces do not match, try again" });
		}
		else{
			console.log("Correct");
			res.json({ success:"Login succesful!" });
			return res
			.status(200);
		}

		//Hashes entered password and compares it with the one in the db.
		// bcrypt.compare(password, user.password).then((match) => {
		// 	//If the password matches generate a payload of user id and password (what does the payload do? research more jwt stuff.)
		// 	if (match) {
		// 		const payload = {
		// 			id: user.id,
		// 			email: user.email,
		// 		};

		// 		//Sign the token with the payload, secret key, and expiration time.
		// 		jsonwebtoken.sign(
		// 			payload,
		// 			SECRET_KEY,
		// 			{ expiresIn: 31556926 },
		// 			(err, token) => {
		// 				res.json({
		// 					success: true,
		// 					token: "Bearer " + token,
		// 				});
		// 			}
		// 		);
		// 	} else {
		// 		return res.status(400).json({ error: "Invalid password dumbass." });
		// 	}
		// });
	});

	return res.status(200);
});

router.post("/check", jsonParser, async (req, res) => {
	console.log("CHECK TEST");
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Content-Type', 'application/json');

	const { errors, notValid } = validateFace(req.body);

	//If the registration input is not valid return an error code with the specific errors present.
	if (notValid) {
		return res.status(400).json(errors);
	}
	//Getting email and password the user entered from the request.
	const email = req.body.email;
	const face = zlib.inflateSync(Buffer.from(req.body.face, "utf-8")).toString("utf-8");

	const labels = [email];
	const refImages = [face];

	await youauth.loadModels().then(model => {console.log(model)}).catch(err => {console.log(err)});

	const faceRec = new youauth.FaceRecognizer();

	let descriptors = await faceRec.labelDescriptors(labels, refImages).then(descript => {return descript}).catch(err => {console.log(err)});
	//console.log(descriptors);
	if(descriptors[0] === undefined) {
		return res.status(400).json({error: "Please take another photo."});
	}
	else {
		res.json({
			success: true,
			desc: descriptors
		});
	}


	//Searching db to see if a user with that email exists.

	return res.status(200);
});

/* GET users listing. */
router.get("/", function (req, res, next) {
	var x = app._router.stack;
	console.log(x);
	res.send("respond with a resource");
});

module.exports = router;
