import "../styles/button.scss"

import React, { Component } from 'react'

export class Button extends Component {
    render() {
        return (
            <div>
                <button className="button" onClick={this.props.submit}>{this.props.name}</button>
            </div>
        )
    }
}