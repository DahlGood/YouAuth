import React from "react";
import loginImage from "../../login.svg";
import {FaceCapture} from "../../../node_modules/youauth/face_capture";
import {ToastContainer, toast, Zoom} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const axios = require("axios");

const zlib = require("zlib");


let faceCapture = null;

//Importing environment variables from .env
require("dotenv").config();
const envVars = process.env;
const { REACT_APP_REGROUTE, REACT_APP_CHECKROUTE } = envVars;

export class Register extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			face: null
		}
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
			"confirm_password": data.get("confirm_password"),
			"face": this.state.face
		};

		axios.post(REACT_APP_REGROUTE, userData).then(response => {
			console.log(response);
			toast.success("Registration successful!");
		}).catch(err =>{
			if(err && err.response && err.response.data){
				console.log(err.response.data);
				toast.error(err.response.data.error);
			}			
		});
		
	}

	handleVideo(e){
		let constraints = {
			video: {
				width: 630,
				height: 500
			}
		};

		var video = document.querySelector('video');
		var imageBitmap;
		faceCapture = new FaceCapture(constraints, video);
		faceCapture.startStream();
	}


	handleCapture(e){
		
		let compressedImage = zlib.deflateSync(faceCapture.takePicture());

		let shortUserData = {
			email: document.getElementById("email").value,
			face: compressedImage
		}
		axios.post(REACT_APP_CHECKROUTE, shortUserData).then(response => {
			this.state.face = response.data.desc;
			toast.success("Image Capture Successful!");
		}).catch(err => {
			if(err && err.response && err.response.data){
				console.log(err.response.data);
				toast.error(err.response.data.error);
			}			
		});

	}

	render() {
		return (
			<div className="base-container">
				<ToastContainer
					autoClose={6000}
					className = "error-toast"
					
				/>
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
							<input type="text" name="email" id="email" placeholder="Email" />
						</div>
						<div className="form-group">
							<input type="password" name="password" placeholder="Password" />
						</div>
						<div className="form-group">
							<input type="password" name="confirm_password" placeholder="Confirm Password" />
						</div>

						<button className="btn">Register</button>
					</form>
					<video id="hi"></video>
					<button onClick = {this.handleVideo.bind(this)}>Button video</button>
					<button onClick = {this.handleCapture.bind(this)}>Capture Image</button>
				</div>
			</div>
			
		);
	}
	
}

