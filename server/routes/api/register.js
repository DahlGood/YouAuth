const validator = require('validator');
import "../../src/util"

module.exports = function validateRegistration(input) {
	let errors = {};
	input.name = empty(input.fName);
	input.name = empty(input.lName);
	input.email = empty(input.email);
	input.password = empty(input.password);
	input.confirm_password = empty(input.confirm_password);

	if(validator.isEmpty(input.fName)) {
		errors.fName = "You must enter a first name.";
	}

	if(validator.isEmpty(input.lName)) {
		errors.lName = "You must enter a last name.";
	}

	if(validator.isEmpty(input.email) && validator.isEmail(input.email)) {
		errors.email = "You must enter a valid email.";
	}

	if(validator.isEmpty(input.password)) {
		errors.password = "You must enter a password.";
	}

	if(validator.isEmpty(input.confirm_password)) {
		errors.confirm_password = "You must confirm your password.";
	}

	if(validator.equals(input.password, input.confirm_password)) {
		errors.confirm_password = "Your passwords do not match."
	}

	/*
	if(face data) {

	}
	*/

	return {errors, valid: errors.length?true:false};

};