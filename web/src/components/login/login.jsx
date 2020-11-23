import React from "react";
import loginImage from "../../login.svg";

const axios = require("axios");

//Importing environment variables from .env
require("dotenv").config();
const envVars = process.env;
const { REACT_APP_LOGINROUTE } = envVars;

export class Login extends React.Component {
	constructor(props) {
		super(props);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleSubmit(event) {
		event.preventDefault();

		const data = new FormData(event.target);
		let userData = {
			"email": data.get("email"),
			"password": data.get("password")
		};
		axios.post(REACT_APP_LOGINROUTE, userData).then(response => console.log(response)).catch(err => console.log(err));
	}

	render() {
		return (
			<div className="base-container">
				<div className="header">Login</div>
				<div className="content">
					<div className="image">
						<img src={loginImage} alt="" />
					</div>
					<form className="form" onSubmit={this.handleSubmit}>
						<div className="form-group">
							<input type="text" name="email" placeholder="Email" />
						</div>
						<div className="form-group">
							<input type="password" name="password" placeholder="Password" />
						</div>
						<button className="btn">Login</button>
					</form>
				</div>
			</div>
		);
	}
}
