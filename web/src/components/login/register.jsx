import React from "react";
import loginImage from "../../login.svg";

const axios = require("axios");

export class Register extends React.Component {
	constructor(props) {
		super(props);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleSubmit(event) {
		event.preventDefault();
		const data = new FormData(event.target);
		let userData = {
			"fName": data.get("fName"),
			"lName": data.get("lName"),
			"email": data.get("email"),
			"password": data.get("password"),
			"confirm_password": data.get("confirm_password")
		};

		axios.post("http://157.245.136.250:3000/users/register", userData).then(response => console.log(response)).catch(err => console.log(err));

	}

	render() {
		return (
			<div className="base-container">
				<div className="header">Register</div>

				<div className="content">
					<div className="image">
						<img src={loginImage} alt="" />
					</div>

					<form className="form" onSubmit={this.handleSubmit}>
						<div className="form-group">
							<input type="text" name="fName" placeholder="First Name" />
						</div>
						<div className="form-group">
							<input type="text" name="lName" placeholder="Last Name" />
						</div>
						<div className="form-group">
							<input type="text" name="email" placeholder="Email" />
						</div>
						<div className="form-group">
							<input type="password" name="password" placeholder="Password" />
						</div>
						<div className="form-group">
							<input type="password" name="confirm_password" placeholder="Confirm Password" />
						</div>

						<button className="btn">Register</button>
					</form>
				</div>
			</div>
		);
	}
}
