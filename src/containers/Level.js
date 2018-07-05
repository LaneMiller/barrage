import React, { Component } from 'react';
import Player from '../components/Player';
import Enemy from '../components/Enemy';
import Pickups from './Pickups'
import { connect } from 'react-redux';
import difficultyAdapter from '../adapters/difficulty'
import { updateEnemyPos } from '../actions'

class Level extends Component {
  state = {
    waveSize: Math.floor(Object.keys(this.props.enemies).length / 3),
    wave: 1,
    doors: null,
  }

  componentDidMount() {
    const delay = difficultyAdapter[this.props.difficulty];
    this.spawnRate = setInterval(this.incrementWave, delay);

    for (let key in this.props.enemies) {
      // set inital location for enemies
      const spawnXY = this.randomSpawnPoints();
      this.props.dispatch( updateEnemyPos({[key]: {...this.props.enemies[key], x: spawnXY[0], y: spawnXY[1]}}) );
    }
  }
  componentWillUnmount() {
    clearInterval(this.spawnRate);
  }
  incrementWave = () => {
    if (this.state.wave < 3) {
      this.setState({ wave: this.state.wave + 1, doors: <img src={require("../openLevel.png")}/>});

      setTimeout(this.closeDoors, 1000);
    }
  }
  closeDoors = () => {
    this.setState({ doors: null })
  }

  randomSpawnPoints = () => {
    // top, right, left, bottom
    let spawnsXY = [[952, 20], [1150, 111], [753, 111], [952, 197]]
    return spawnsXY[Math.floor(Math.random() * spawnsXY.length)];
  }

  renderEnemies = () => {
    const { waveSize } = this.state;
    const { dead } = this.props;
    const { top, bottom, left, right } = this.props.levelBounds;
    const map = [];

    let i = 0;
    for (let key in this.props.enemies) {
      if (this.state.wave === 1 && i < waveSize - dead) {
        map.push(<Enemy key={key} {...this.props.enemies[key]} />)
      } else if (this.state.wave === 2 && i < (waveSize*2 - dead)) {
        map.push(<Enemy key={key} {...this.props.enemies[key]} />)
      } else if (this.state.wave > 2) {
        map.push(<Enemy key={key} {...this.props.enemies[key]} />)
      };
      i++
    };

    return map;
  }

  render() {
    const Enemies = this.renderEnemies()
    const openDoors = this.state.doors !== null ? this.state.doors : null

    return (
      <div className='level'>
        {openDoors}
        <Pickups />
        <Player />
        {Enemies}
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    levelBounds: state.level.bounds,
    dead: state.level.killedEnemies,
    enemies: state.level.enemies,
  }
}
export default connect(mapStateToProps)(Level);
