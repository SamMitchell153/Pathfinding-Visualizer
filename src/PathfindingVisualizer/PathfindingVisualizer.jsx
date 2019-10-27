import React, {Component} from 'react';
import Node from './Node/Node';

import './PathfindingVisualizer.css';

export default class PathfindingVisualizer extends Component {
  constructor() {
    super();
    this.state = {};
  }

  render() {
    const {grid, mouseIsPressed} = this.state;

    return <div>Pathfinder</div>;
  }
}
