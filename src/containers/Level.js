import React, { Component } from 'react';
import Player from '../components/Player';
import Enemy from '../components/Enemy';
import Pickups from './Pickups'
import { connect } from 'react-redux';
import difficultyAdapter from '../adapters/difficulty'

class Level extends Component {
  state = {
    waveSize: Math.floor(Object.keys(this.props.enemies).length / 3),
    wave: 1,
  }

  componentDidMount() {
    const delay = difficultyAdapter[this.props.difficulty];
    this.spawnRate = setInterval(this.incrementWave, delay);
  }
  componentWillUnmount() {
    clearInterval(this.spawnRate);
  }
  incrementWave = () => {
    this.setState({ wave: this.state.wave + 1})
  }

  renderEnemies = () => {
    const { waveSize } = this.state;
    const { dead } = this.props;
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

    return (
      <div className='level'>
        <Pickups />
        <Player />
        {Enemies}
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    dead: state.level.killedEnemies,
    enemies: state.level.enemies,
  }
}
export default connect(mapStateToProps)(Level);
