import React, { Component } from "react";
import Node from "./Node/Node";

import "./PathfindingVisualizer.css";

const START_NODE_ROW = 10;
const START_NODE_COL = 15;
const FINISH_NODE_ROW = 10;
const FINISH_NODE_COL = 35;

export default class PathfindingVisualizer extends Component {
	constructor() {
		super();
		this.state = {
			grid: []
		};
	}

	componentDidMount() {
		const grid = getInitialGrid();
		this.setState({ grid });
	}

	render() {
		const { grid } = this.state;

		return (
			<>
				<button>Visualise</button>
				<div className="grid">
					{grid.map((row, rowIdx) => {
						return (
							<div key={rowIdx}>
								{row.map((node, nodeIdx) => {
									const { row, col, isStart, isFinish } = node;
									return (
										<Node
											key={nodeIdx}
											col={col}
											row={row}
											isStart={isStart}
											isFinish={isFinish}
										></Node>
									);
								})}
							</div>
						);
					})}
				</div>
			</>
		);
	}
}

const getInitialGrid = () => {
	const grid = [];
	for (let y = 0; y < 20; y++) {
		const thisRow = [];
		for (let x = 0; x < 50; x++) {
			thisRow.push(createNode(x, y));
		}
		grid.push(thisRow);
	}
	return grid;
};

const createNode = (col, row) => {
	return {
		col,
		row,
		previousNode: null
	};
};
