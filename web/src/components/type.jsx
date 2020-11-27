import "../styles/type.scss"
import "../styles/panel.scss"

import React, { Component } from 'react'

export class Type extends Component {

    constructor(props) {
		super(props);
		this.state = {
            
        }
    }

    render() {
        return (
            // update class list depending on state
            <div className="type left">
                <div className="text"></div>
            </div>
        )
    }
}