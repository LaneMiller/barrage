import React, { Component } from 'react';
import Player from '../components/Player';
import Enemy from '../components/Enemy';
import Pickups from './Pickups'
import { connect } from 'react-redux';

class Level extends Component {
  renderEnemies = () => {
    const { enemies } = this.props
    const map = [];
    for ( let key in enemies) {
      map.push(<Enemy key={key} {...enemies[key]} />)
    }
    return map
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
    enemies: state.level.enemies,
  }
}
export default connect(mapStateToProps)(Level);
