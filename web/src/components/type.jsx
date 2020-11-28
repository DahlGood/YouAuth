import "../styles/type.scss"
import "../styles/panel.scss"

import React, { Component } from 'react'

export class Type extends Component {

    constructor(props) {
        super(props);
        this.state = {
            position: this.props.position,
        }
    }

    handleClick = (e) =>{
        let x = this.state.position ? 0:1;
        this.setState({position: x})
        this.props.positionChange(x);
    }

    render() {
        console.log();
        return (
            // update class list depending on state
            // {`type ${this.props.positon ? "left":"left"}`}
            <div id="posStatus" className={`type ${this.state.position ? "left":"right"}`} onClick={this.handleClick}>
                <div className="text">{this.state.position ? "Register": "Login"}</div>
            </div>
        )
    }
}