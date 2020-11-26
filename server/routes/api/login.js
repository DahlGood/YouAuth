const validator = require('validator');
const isEmpty = require('is-empty');

module.exports = function validateLogin(input) {
	let errors = {};
	input.email = !isEmpty(input.email) ? input.email : "";
	input.face = !isEmpty(input.face) ? input.face : "";
	input.password = !isEmpty(input.password) ? input.password : "";

	if(validator.isEmpty(input.email) && validator.isEmail(input.email)) {
		errors.email = "You must enter a valid email.";
	}
	console.log("input face: ", input);
	console.log("This is validator: ", validator.isEmpty(input.password));
	console.log("This is inputFace length: ", input.face.toString('utf-8').length==0);
	//console.log(validator.isEmpty(input.password) && (input.face.toString('utf-8').length==0));
	if (validator.isEmpty(input.password) && (input.face.toString('utf-8').length==0)) {
		errors.password = "Please enter a password or select a face-capture for login!";
		//console.log("inside print statement")
	}
	//console.log("hello");

	/*
	if(face data) {
	}
	*/
	console.log(Object.keys(errors).length);
	return {errors, notValid: Object.keys(errors).length ? true:false};

};