import React, { Component } from 'react';
import Player from '../components/Player'
import Enemy from '../components/Enemy'

class Level extends Component {
  render() {
    return (
      <div className='level'>
        <Player />
        <Enemy />
      </div>
    )
  }
}

export default Level
