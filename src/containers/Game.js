import React, { Component } from 'react';
import Level from './Level'
import '../game.css'

class Game extends Component {
  render() {
    return (
      <div className='game'>
        {/*
          <img src={require("../closedLevelBlue.png")}/>
          <img src={require("../Background.png")}/>
          */}
          <img src={require("../level.png")}/>
        <Level {...this.state} />
      </div>
    )
  }
}

export default Game;
