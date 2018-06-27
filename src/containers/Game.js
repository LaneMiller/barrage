import React, { Component } from 'react';
import Level from './Level'
import '../game.css'

class Game extends Component {
  render() {
    return (
      <div className='game'>
        <img src={require("../Background.png")}/>
        <Level />
      </div>
    )
  }
}

// <SpriteSheet filename={Walk_Anim} data={walkAnim} sprite={this.state.activeSprite} />
// const walkAnim = {
//   walk0: {
//     x: 0,
//     y: 0,
//     width: 17,
//     height: 24,
//   },
//   walk1: {
//     x: 17,
//     y: 0,
//     width: 17,
//     height: 24,
//   },
//   walk2: {
//     x: 34,
//     y: 0,
//     width: 17,
//     height: 24,
//   },
//   walk3: {
//     x: 0,
//     y: 24,
//     width: 17,
//     height: 24,
//   },
//   walk4: {
//     x: 17,
//     y: 24,
//     width: 17,
//     height: 24,
//   },
//   walk5: {
//     x: 34,
//     y: 24,
//     width: 17,
//     height: 24,
//   }
// };
export default Game;
