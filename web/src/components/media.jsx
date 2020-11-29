import "../styles/media.scss"
import loginImage from "../login.svg";

import React, { Component } from 'react'

export class Media extends Component {
    render() {
        return (
            
            <div className="media">
                <img src={loginImage} alt="" />
            </div>
        )
    }
}