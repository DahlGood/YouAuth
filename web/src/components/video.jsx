
import "../styles/video.scss"
import React, { Component } from 'react'




export class Video extends Component {

    constructor(props) {
		super(props);
		this.state = {
			face: null
		}
		//this.handleSubmit = this.handleSubmit.bind(this);
	}
   
    
    
    render() {
		return (
			<div className="video">
					<video></video>
			</div>
		);
	}
}