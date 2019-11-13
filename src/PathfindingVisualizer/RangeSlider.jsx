import React, { Component } from "react";
import Slider from "react-rangeslider";

import { Col, Row } from "react-bootstrap";

class Horizontal extends Component {
	constructor(props, context) {
		super(props, context);
		this.state = {
			value: 30
		};
	}

	handleChange = value => {
		this.setState({
			value: value
		});
		this.props.callbackFromParent(value);
	};

	render() {
		let { value } = this.state;
		return (
			<Row className="slider">
				<Col id="xValueLabel" xs="1">
					{value}
				</Col>
				<Col className="slider" xs="11">
					<Slider
						min={10}
						max={100}
						value={value}
						onChange={this.handleChange}
					/>
				</Col>
			</Row>
		);
	}
}

class Vertical extends Component {
	constructor(props, context) {
		super(props, context);
		this.state = {
			value: 25
		};
	}

	handleChange = value => {
		this.setState({
			value: value
		});
		this.props.callbackFromParent(value);
	};
	render() {
		const { value } = this.state;
		return (
			<div className="slider orientation-reversed">
				<div className="slider-vertical">
					<div id="yValueLabel">{value}</div>
					<Slider
						min={10}
						max={50}
						value={value}
						orientation="vertical"
						reverse={true}
						onChange={this.handleChange}
					/>
				</div>
			</div>
		);
	}
}

export { Horizontal, Vertical };
