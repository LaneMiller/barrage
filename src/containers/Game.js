import React, { Component } from 'react';
import Level from './Level'
import '../game.css'
import { SpriteSheet } from 'react-spritesheet'

class Game extends Component {
  render() {
    return (
      <div className='game'>
        {/*
          <img src={require("../Background.png")}/>
          <img src={require("../closedLevelBig.png")}/>
          */}
          <img src={require("../closedLevel.png")}/>
        <Level {...this.state} />
      </div>
    )
  }
}

export default Game;
