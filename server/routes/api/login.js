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

	if(validator.isEmpty(input.password) && validator.isEmpty(input.face)) {
		errors.password = "Please enter a password or select a face-capture for login!";
	}

	/*
	if(face data) {
	}
	*/

	return {errors, valid: errors.length?true:false};

};