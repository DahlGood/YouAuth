const validator = require('validator');
const isEmpty = require('is-empty');

module.exports = function validateRegistration(input) {
	let errors = {};
	input.name = !isEmpty(input.fName) ? input.fName : "";
	input.name = !isEmpty(input.lName) ? input.lName : "";
	input.email = !isEmpty(input.email) ? input.email : "";
	input.password = !isEmpty(input.password) ? input.password : "";
	input.confirm_password = !isEmpty(input.confirm_password) ? input.confirm_password : "";

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

	if(!validator.equals(input.password, input.confirm_password)) {
		errors.confirm_password = "Your passwords do not match."
	}

	return {errors, notValid: Object.keys(errors).length ? true:false};
};
