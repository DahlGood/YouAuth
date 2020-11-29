const validator = require('validator');
const isEmpty = require('is-empty');

module.exports = function validateFace(input) {
	let errors = {};
	input.email = !isEmpty(input.email) ? input.email : "";
	input.face = !isEmpty(input.face) ? input.face : "";

	if(validator.isEmpty(input.email) && validator.isEmail(input.email)) {
		errors.email = "You must enter a email.";
	}
	if(validator.isEmpty(JSON.stringify(input.face))) {
		errors.face = "You must enter a face.";
	}

	return {errors, notValid: Object.keys(errors).length ? true:false};
};
