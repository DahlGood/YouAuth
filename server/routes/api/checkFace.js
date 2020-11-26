const validator = require('validator');
const isEmpty = require('is-empty');

module.exports = function validateFace(input) {
	let errors = {};
	input.email = !isEmpty(input.email) ? input.email : "";
	input.face = !isEmpty(input.face) ? input.face : "";

	if(validator.isEmpty(input.email) && validator.isEmail(input.email)) {
		errors.fName = "You must enter a first name.";
	}
	console.log(input.face);
	if(validator.isEmpty(JSON.stringify(input.face))) {
		errors.lName = "You must enter a last name.";
	}

	return {errors, valid: errors.length?true:false};

};