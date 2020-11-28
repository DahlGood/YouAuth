import "../styles/header.scss"
import "../styles/account.scss"

import React, { Component } from 'react'

export class Header extends Component {
    render() {
        return (
            <div className="header">
                {this.props.position ? "Login":"Register"}
            </div>
        )
    }
}