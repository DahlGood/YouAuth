import React from "react";
import loginImage from "../../login.svg";

const axios = require("axios");

export class Register extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event) {
    event.preventDefault();
    const data = new FormData(event.target);
    let userData = {
      "fName": data.get("fName"),
      "lName": data.get("lName"),
      "email": data.get("email"),
      "password": data.get("password"),
      "confirm_password": data.get("confirm_password")
    };

    //var jsonData = JSON.stringify(userData);

    // var myHeaders = new Headers();
    // myHeaders.append('Content-Type', 'application/json');

    // var requestOpts = {
    //   method: 'POST',
    //   headers: myHeaders,
    //   body: jsonData,
    //   redirect: 'follow'
    // };

    axios.post("http://157.245.136.250:3000/users/register", userData).then(response => console.log(response));

    // fetch("http://157.245.136.250:3000/users/register", requestOpts )
    //   .then((response) => response.text())
    //   .then((result) => console.log(result))
    //   .catch((error) => console.log("error", error));
  }

  render() {
    return (
      <div className="base-container">
        <div className="header">Register</div>

        <div className="content">
          <div className="image">
            <img src={loginImage} />
          </div>

          <form className="form" onSubmit={this.handleSubmit}>
            <div className="form-group">
              <label htmlFor="fName">fName</label>
              <input type="text" name="fName" placeholder="fName" />
            </div>
            <div className="form-group">
              <label htmlFor="lName">lName</label>
              <input type="text" name="lName" placeholder="lName" />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input type="text" name="email" placeholder="email" />
            </div>
            <div className="form-group">
              <label htmlFor="password">password</label>
              <input type="text" name="password" placeholder="password" />
            </div>
            <div className="form-group">
              <label htmlFor="confirm_password">confirm_password</label>
              <input
                type="text"
                name="confirm_password"
                placeholder="confirm_password"
              />
            </div>

            <button>Send INfo</button>
          </form>
        </div>
      </div>
    );
  }
}
