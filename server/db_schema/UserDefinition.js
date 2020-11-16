const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Note this is a mongodb model.

// https://mongoosejs.com/docs/api.html#schema_Schema
//Defining what a User is in our database. 
const UserSchema = new Schema({
	fName: {
		type: String,
		required: true
	},
	lName: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true
	},
	password: {
		type: String,
		required: true
	},
	date: {
		type: Date,
		default: Date.now
	}
	/*
	,
	face something: {
		how will we store face data?
	}
	*/
});