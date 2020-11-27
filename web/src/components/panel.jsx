import "../styles/panel.scss"

import { Login, Register, Type } from "./index";

import React, { Component } from 'react'

export class Panel extends Component {

    constructor(props) {
		super(props);
		this.state = {
            position: 1
        }
    }

    render() {
        return (
            <div className="panel">
                {/* Depending on State Load Login or Register */}
                <Login />
                <Type />
            </div>
            
        )
    }
}
