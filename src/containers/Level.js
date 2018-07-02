import React, { Component } from 'react';
import Player from '../components/Player';
import Enemy from '../components/Enemy';
import { connect } from 'react-redux';
import { removeEnemy } from '../actions';

class Level extends Component {
  renderEnemies = () => {
    const { enemies } = this.props
    const map = [];
    for ( let key in enemies) {
      if (enemies[key].health > 0) {
        map.push(<Enemy key={key} {...enemies[key]} />)
      } else {
        const remaining = {...enemies}
        delete remaining[key]
        this.props.dispatch( removeEnemy(remaining) )
      }
    }
    return map
  }

  render() {
    const enemies = this.renderEnemies()
    return (
      <div className='level'>
        <Player />
        {enemies}
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
