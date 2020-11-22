import React from "react";
import loginImage from "../../login.svg";

const axios = require("axios");

export class Login extends React.Component {
  constructor(props) {
    super(props);
  }

  handleSubmit(event) {
    event.preventDefault();
    const data = new FormData(event.target);
    let userData = {
      "email": data.get("email"),
      "password": data.get("password")
    };

    axios.post("http://157.245.136.250:3000/users/login", userData).then(response => console.log(response));
  }

  render() {
    return (
      <div className="base-container">
        <div className="header">Login</div>
        <div className="content">
          <div className="image">
            <img src={loginImage} />
          </div>
          <form className="form" onSubmit={this.handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input type="text" name="email" placeholder="email" />
            </div>
            <div className="form-group">
              <label htmlFor="password">password</label>
              <input type="text" name="password" placeholder="password" />
            </div>
            <button>Send INfo</button>
          </form>
        </div>
      </div>
    );
  }
}
