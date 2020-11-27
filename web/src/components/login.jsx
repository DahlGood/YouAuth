import React from "react";
import "../styles/account.scss"
import "../styles/login.scss"

import { Header, Media, Input, Footer, Button, Type } from "./index";

import {ToastContainer, toast, Zoom} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
		axios.post(REACT_APP_LOGINROUTE, userData).then(response => {
			console.log(response);
			toast.success("Login successful!");
			}).catch(err =>{
			if(err && err.response && err.response.data){
				console.log(err.response.data);
				toast.error(err.response.data.error);
			}			
			});
	}

	render() {
		return (
			<div className="accounts login">
				<div className="">
					<Header position={1} />
					<Media />
					<ToastContainer autoClose={6000} className = "error-toast" />
					{/* This form could be placed in the Input component and have all input elements mapped and displayed automatically. */}
					<div className="input">
					<form className="form" onSubmit={this.handleSubmit}>
						<div className="form-group">
							<input type="text" name="email" placeholder="Email" />
						</div>
						<div className="form-group">
							<input type="password" name="password" placeholder="Password" />
						</div>
						<button className="button">Login</button>
					</form>
					</div>
					<Footer />
				</div>
			</div>
		);
	}
}
