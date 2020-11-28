import "../styles/panel.scss"

import { Login, Register, Type } from "./index";

import React, { Component } from 'react'

export class Panel extends Component {

    constructor(props) {
		super(props);
		this.state = {
            position: 0,
            hasVideo: 0
        }
    }

    handlePositionChange = (posData) => {
        this.setState({position: posData});
    }

    render() {
        return (
            <div className="panel">
                {
                    this.state.position ? <Login/> : <Register />
                }
                <Type positionChange={this.handlePositionChange} position={this.state.position} />
            </div>
            
        )
    }
}
