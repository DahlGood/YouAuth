const validator = require('validator');
import "../../src/util"

module.exports = function validateLogin(input) {
	let errors = {};
	input.email = empty(input.email);
	input.password = empty(input.password);

	if(validator.isEmpty(input.email) && validator.isEmail(input.email)) {
		errors.email = "You must enter a valid email.";
	}

	if(validator.isEmpty(input.password)) {
		errors.password = "You must enter a password.";
	}

	/*
	if(face data) {

	}
	*/

	return {errors, valid: errors.length?true:false};

};
