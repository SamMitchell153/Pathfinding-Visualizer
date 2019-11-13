import React, { Component } from "react";
import Node from "./Node/Node";

import { dijkstra, getNodesInShortestPathOrder } from "../algorithms/dijkstra";
import { aStar } from "../algorithms/astar";

import "./PathfindingVisualizer.css";
import "bootstrap/dist/css/bootstrap.min.css";

import {
	Container,
	Col,
	Row,
	Button,
	Nav,
	Navbar,
	NavDropdown
} from "react-bootstrap";

import "react-rangeslider/lib/index.css";

import { Horizontal, Vertical } from "./RangeSlider.jsx";

let START_NODE_ROW = 10;
let START_NODE_COL = 5;
let FINISH_NODE_ROW = 10;
let FINISH_NODE_COL = 25;

let totalRows = 20;
let totalCols = 30;

export default class PathfindingVisualizer extends Component {
	constructor() {
		super();
		this.state = {
			grid: [],
			mouseIsPressed: false,
			selectedAlgorithm: "None",
			cols: 25,
			rows: 30
		};
	}

	componentDidMount() {
		const grid = getInitialGrid();
		this.setState({ grid });
		document.title = "Pathfinding Visualiser";

		if (totalCols > 40) {
			document.getElementsByClassName("grid")[0].className = "grid halfSize";
		} else {
			document.getElementsByClassName("grid")[0].className = "grid";
		}
	}

	handleMouseDown(row, col) {
		const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
		this.setState({ grid: newGrid, mouseIsPressed: true });
	}

	handleMouseEnter(row, col) {
		if (!this.state.mouseIsPressed) return;
		const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
		this.setState({ grid: newGrid });
	}

	handleMouseUp() {
		this.setState({ mouseIsPressed: false });
	}

	animate(visitedNodesInOrder, nodesInShortestPathOrder) {
		for (let i = 0; i <= visitedNodesInOrder.length; i++) {
			if (i === visitedNodesInOrder.length) {
				setTimeout(() => {
					this.animateShortestPath(nodesInShortestPathOrder);
				}, 10 * i);
				return;
			}
			setTimeout(() => {
				const node = visitedNodesInOrder[i];
				document.getElementById(`node-${node.row}-${node.col}`).className +=
					" node-visited";
			}, 10 * i);
		}
	}

	animateShortestPath(nodesInShortestPathOrder) {
		for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
			setTimeout(() => {
				const node = nodesInShortestPathOrder[i];
				document.getElementById(`node-${node.row}-${node.col}`).className +=
					" node-shortest-path";
			}, 50 * i);
		}
	}

	visualize() {
		switch (this.state.selectedAlgorithm) {
			case "Dijkstra":
				this.visualizeDijkstra();
				console.log("Visualizing Dijkstra");
				break;
			case "A*":
				this.visualizeAStar();
				console.log("Visualizing A*");
				break;
			default:
				// run error, no selected algorithm
				console.log("No Input selected");
		}
	}

	visualizeDijkstra() {
		const { grid } = this.state;
		const startNode = grid[START_NODE_ROW][START_NODE_COL];
		const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
		const visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
		const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
		this.animate(visitedNodesInOrder, nodesInShortestPathOrder);
	}

	visualizeAStar() {
		const { grid } = this.state;
		const startNode = grid[START_NODE_ROW][START_NODE_COL];
		const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
		const visitedNodesInOrder = aStar(grid, startNode, finishNode);
		const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
		this.animate(visitedNodesInOrder, nodesInShortestPathOrder);
	}

	reset() {
		window.location.reload();
	}

	updateRows = updatedRows => {
		totalRows = updatedRows;

		START_NODE_ROW = Math.floor(updatedRows / 2);
		FINISH_NODE_ROW = Math.floor(updatedRows / 2);
	};

	updateCols = updatedCols => {
		totalCols = updatedCols;
		START_NODE_COL = Math.floor(updatedCols / 5);
		FINISH_NODE_COL = updatedCols - Math.ceil(updatedCols / 5);
	};

	render() {
		const { grid, mouseIsPressed, selectedAlgorithm } = this.state;

		return (
			<>
				<Navbar bg="light" expand="lg">
					<Navbar.Brand href="#home"> Pathfinding Visualiser</Navbar.Brand>
					<Navbar.Toggle aria-controls="basic-navbar-nav" />
					<Navbar.Collapse id="basic-navbar-nav">
						<Nav className="mr-auto">
							<NavDropdown title={"Selected Algorithm: " + selectedAlgorithm}>
								<NavDropdown.Header>Unweighted</NavDropdown.Header>
								<NavDropdown.Item
									onClick={() =>
										this.setState({ selectedAlgorithm: "Dijkstra" })
									}
								>
									Dijkstra
								</NavDropdown.Item>
								<NavDropdown.Divider />
								<NavDropdown.Header>Weighted</NavDropdown.Header>
								<NavDropdown.Item
									onClick={() => this.setState({ selectedAlgorithm: "A*" })}
								>
									A*
								</NavDropdown.Item>
							</NavDropdown>
						</Nav>
						<Button onClick={() => this.visualize()}>Visualize</Button>
						<Button onClick={() => this.reset()}>Reset</Button>
					</Navbar.Collapse>
				</Navbar>

				<Container>
					<Row>
						<Col xs="1">
							<Button onClick={() => this.componentDidMount()}>Update</Button>
						</Col>
						<Col xs="11">
							<div className="gridXSlider">
								<Horizontal
									id="XSlider"
									callbackFromParent={this.updateCols}
								></Horizontal>
							</div>
						</Col>
					</Row>
					<Row>
						<Col xs="1">
							<div className="gridYSlider">
								<Vertical
									id="YSlider"
									callbackFromParent={this.updateRows}
								></Vertical>
							</div>
						</Col>
						<Col xs="11">
							<div className="grid">
								{grid.map((row, rowIdx) => {
									return (
										<Row key={rowIdx}>
											{row.map((node, nodeIdx) => {
												const { row, col, isFinish, isStart, isWall } = node;
												return (
													<Node
														key={nodeIdx}
														col={col}
														isFinish={isFinish}
														isStart={isStart}
														isWall={isWall}
														mouseIsPressed={mouseIsPressed}
														onMouseDown={(row, col) =>
															this.handleMouseDown(row, col)
														}
														onMouseEnter={(row, col) =>
															this.handleMouseEnter(row, col)
														}
														onMouseUp={() => this.handleMouseUp()}
														row={row}
													></Node>
												);
											})}
										</Row>
									);
								})}
							</div>
						</Col>
					</Row>
				</Container>
			</>
		);
	}
}

const getInitialGrid = () => {
	const grid = [];

	for (let row = 0; row < totalRows; row++) {
		const currentRow = [];
		for (let col = 0; col < totalCols; col++) {
			currentRow.push(createNode(col, row));
		}
		grid.push(currentRow);
	}
	return grid;
};

const createNode = (col, row) => {
	return {
		col,
		row,
		isStart: row === START_NODE_ROW && col === START_NODE_COL,
		isFinish: row === FINISH_NODE_ROW && col === FINISH_NODE_COL,
		distance: Infinity,
		distanceToEnd: Infinity,
		isVisited: false,
		isWall: false,
		previousNode: null
	};
};

const getNewGridWithWallToggled = (grid, row, col) => {
	const newGrid = grid.slice();
	const node = newGrid[row][col];
	const newNode = {
		...node,
		isWall: !node.isWall
	};
	newGrid[row][col] = newNode;
	return newGrid;
};
