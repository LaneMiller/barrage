import React, { Component } from 'react';
import Level from './Level'
import '../game.css'

class Game extends Component {
  // state = {
  //   level: {
  //     bounds: [],
  //     exits: [],
  //     enemies: [],
  //   },
  //   player: {
  //     health: 100,
  //   }
  // }

  render() {
    return (
      <div className='game'>
        <img src={require("../Background.png")}/>
        <Level {...this.state} />
      </div>
    )
  }
}

export default Game;
