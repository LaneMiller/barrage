import React, { Component } from 'react';
import { connect } from 'react-redux';

import Player from '../components/Player';
import Enemy from '../components/Enemy';
import Pickups from './Pickups'

import difficultyAdapter from '../adapters/difficulty'
import { updateEnemyPos, updatePlayerLevelStatus, incrementWaveCount } from '../actions'

class Level extends Component {
  state = {
    doors: null,
    levelExits: null,
  }

  componentDidMount() {
    const delay = difficultyAdapter[this.props.difficulty];
    this.spawnRate = setInterval(this.incrementWave, delay);

    this.setSpawnPoints();
    this.incrementWave();
  }
  componentWillUnmount() {
    clearInterval(this.spawnRate);
  }
  componentDidUpdate(prevProps) {
    if (this.props.levelId !== prevProps.levelId) {
      this.setSpawnPoints();
    }
  }
  incrementWave = () => {
    if (this.props.wave < 3) {
      this.props.dispatch( incrementWaveCount() );
      this.setState({
        doors: <img src={require("../openLevelMinimal.png")}/>
      });

      setTimeout(this.closeDoors, 1000);
    }
  }
  closeDoors = () => {
    this.setState({ doors: null })
  }

  randomSpawnPoints = () => {
    // top, right, bottom, left
    let spawnsXY = [[952, 20], [1150, 111], [952, 197], [753, 111]]
    return spawnsXY[Math.floor(Math.random() * spawnsXY.length)];
  }

  setSpawnPoints = () => {
    console.log('here', this.props.enemies);
    for (let key in this.props.enemies) {
      // set inital location for enemies
      const spawnXY = this.randomSpawnPoints();

      this.props.dispatch( updateEnemyPos({[key]: {...this.props.enemies[key], x: spawnXY[0], y: spawnXY[1]}}) );
    }
  }

  renderEnemies = () => {
    const { waveSize, dead } = this.props;
    const { top, bottom, left, right } = this.props.levelBounds;
    const map = [];

    let i = 0;
    for (let key in this.props.enemies) {
      if (this.props.wave === 1 && i < waveSize - dead) {
        map.push(<Enemy key={key} {...this.props.enemies[key]} />)
      } else if (this.props.wave === 2 && i < (waveSize*2 - dead)) {
        map.push(<Enemy key={key} {...this.props.enemies[key]} />)
      } else if (this.props.wave > 2) {
        map.push(<Enemy key={key} {...this.props.enemies[key]} />)
      };
      i++
    };

    return map;
  }

  renderExits = () => {
    if (Object.keys(this.props.enemies).length === 0) {
      this.props.dispatch( updatePlayerLevelStatus('clear') )
      return <img src={require("../exitRight.png")}/>
    } else {
      return null;
    }
  }

  render() {
    const Enemies = this.renderEnemies();
    const openDoors = this.state.doors !== null ? this.state.doors : null;
    const levelExits = this.renderExits();

    return (
      <div className='level'>
        {openDoors}
        {levelExits}
        <Pickups />
        <Player />
        {Enemies}
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    wave: state.level.wave,
    waveSize: state.level.waveSize,
    levelBounds: state.level.bounds,
    dead: state.level.killedEnemies,
  }
}
export default connect(mapStateToProps)(Level);
