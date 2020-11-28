import React from "react";
import "./styles/app.scss";
import { Panel } from "./components/index";

export default class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			isLogginActive: true,
		};
	}

	componentDidMount() {
		//Add .right by default
		// this.rightSide.classList.add("right");
	}

	changeState() {
		// const { isLogginActive } = this.state;

		// if (isLogginActive) {
		// 	this.rightSide.classList.remove("right");
		// 	this.rightSide.classList.add("left");
		// 	document.getElementsByClassName("container")[0].classList.remove("login-pane");
		// 	document.getElementsByClassName("container")[0].classList.add("register-pane");
			
		// } else {
		// 	this.rightSide.classList.remove("left");
		// 	this.rightSide.classList.add("right");
		// 	document.getElementsByClassName("container")[0].classList.remove("register-pane");
		// 	document.getElementsByClassName("container")[0].classList.add("login-pane");
		// }
		// this.setState((prevState) => ({
		// 	isLogginActive: !prevState.isLogginActive,
		// }));
	}

	render() {
		// const { isLogginActive } = this.state;
		// const current = isLogginActive ? "Register" : "Login";
		// const currentActive = isLogginActive ? "login" : "register";
		return (
			<div className = "app">
				<div>
					<Panel />
				</div>
			</div>
			







			// <div className="app">
			// 	<div className="login">
			// 		<div className="container login-pane" ref={(ref) => (this.container = ref)}>
			// 			{isLogginActive && (
			// 				<Login containerRef={(ref) => (this.current = ref)} />
			// 			)}
			// 			{!isLogginActive && (
			// 				<Register containerRef={(ref) => (this.current = ref)} />
			// 			)}
			// 		</div>
			// 		<RightSide
			// 			current={current}
			// 			currentActive={currentActive}
			// 			containerRef={(ref) => (this.rightSide = ref)}
			// 			onClick={this.changeState.bind(this)}
			// 		/>
			// 	</div>
			// </div>
		);
	}
}



//export default App;
