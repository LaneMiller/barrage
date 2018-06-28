import React, { Component } from 'react';
import Player from '../components/Player';
import Enemy from '../components/Enemy';
import { connect } from 'react-redux';

class Level extends Component {
  renderEnemies = () => {
    const map = [];
    for ( let key in this.props.enemies) {
      map.push(<Enemy key={key} {...this.props.enemies[key]} />)
    }
    return map
    // return this.props.enemies.map( enemy => (
    //   <Enemy {...enemy} />
    // ))
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
