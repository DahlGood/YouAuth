import React from "react";
import "../styles/account.scss"
import "../styles/login.scss"
import faceIcon from "../Camera-icon.png"
import { Header, Media, Input, Footer, Button, Type } from "./index";
import {FaceCapture} from "../../node_modules/youauth/face_capture";

import {ToastContainer, toast, Zoom} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const axios = require("axios");
const zlib = require("zlib");
let faceCapture = null;
//Importing environment variables from .env
require("dotenv").config();
const envVars = process.env;
const { REACT_APP_LOGINROUTE, REACT_APP_CHECKROUTE } = envVars;

export class Login extends React.Component {
	constructor(props) {
		super(props);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.state = {
			face: null
		}
	}

	handleSubmit(event) {
		event.preventDefault();

		const data = new FormData(event.target);
		let userData = {
			"email": data.get("email"),
			"password": data.get("password"),
			"face" : this.state.face
		};
		//axios.post(REACT_APP_LOGINROUTE, userData).then(response => console.log(response)).catch(err => console.log(err));
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

		this.state.face = compressedImage;
		toast.success("Image capture successful, try to login dumbass");
		
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
							<input type="text" name="email" placeholder="Email" id ="email"/>
						</div>
						<div className="form-group" style= {{flexDirection:"row"}}>
							<input type="password" name="password" placeholder="Password" />
							<button className = "camera"><img src = {faceIcon}/></button>
						</div>
						<button className="button">Login</button>
					</form>
					<button onClick = {this.handleVideo.bind(this)}>Button video</button>
					<button onClick = {this.handleCapture.bind(this)}>Capture Image</button>
					</div>
					<Footer />
				</div>
			</div>
		);
	}
}
