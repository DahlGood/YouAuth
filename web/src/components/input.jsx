import "../styles/input.scss"

import React, { Component } from 'react'

import { Button } from "./index";

export class Input extends Component {
    render() {
        return (
            <div className="input">
                <form className="form" onSubmit={this.handleSubmit}>
                    <div className="form-group">
                        <input type="text" name="email" placeholder="Email" />
                    </div>
                    <div className="form-group">
                        <input type="password" name="password" placeholder="Password" />
                    </div>
                    <Button />
				</form>
            </div>
        )
    }
}