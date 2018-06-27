import React from 'react';
import {SpriteSheet, AnimatedSpriteSheet} from 'react-spritesheet'
import Walk_Anim from "../Walk_Anim.png"

class Player extends React.Component {
  state = {
    x: 953,
    y: 90,
    rotation: 0,
    walking: false,
  }

  componentDidMount() {
    this.keyState = {}
    window.addEventListener("keydown", this.handleMovement)
    window.addEventListener("keyup", this.stopMovement)
    setInterval(this.movementLogic, 20)
  }

  handleMovement = (e) => {
    this.keyState[e.key] = true;
    this.animateSprite()
  }

  animateSprite = () => {
    this.setState({walking: true})
  }

  movementLogic = () => {
    let x = this.state.x,
        y = this.state.y,
        rotation = this.state.rotation

    if (this.keyState['w'] || this.keyState['ArrowUp']) {
      rotation = 180;
      if (this.state.y <= 9) {
        y = 9;
      } else {
        y-= 4;
      }
    }
    if (this.keyState['s'] || this.keyState['ArrowDown']) {
      rotation = 360;
      if (this.state.y >= 179) {
        y = 179;
      } else {
        y += 4;
      }
    }
    if (this.keyState['a'] || this.keyState['ArrowLeft']) {
      rotation = 90;
      if (this.state.x <= 770) {
        x = 770;
      } else {
        x -= 4;
      }
    }
    if (this.keyState['d'] || this.keyState['ArrowRight']) {
      rotation = 270;
      if (this.state.x >= 1133) {
        x = 1133;
      } else {
        x += 4;
      }
    }

    this.setState({rotation, x, y });
  }

  stopMovement = (e) => {
    this.keyState[e.key] = false;
    this.stopSprite()
  }

  stopSprite = () => {
    this.setState({walking: false})
  }

  renderPlayer = () => {
    const data = {
      idle: {
        x: 0,
        y: 0,
        width: 17,
        height: 24,
      }
    }
    if (this.state.walking) {
      return <AnimatedSpriteSheet
        filename={Walk_Anim}
        initialFrame={0}
        frame={{ width: 17, height: 24 }}
        bounds={{ x: 0, y: 0, width: 32, height: 48 }}
        isPlaying
        loop
        speed={105}
      />
  } else {
    return <SpriteSheet filename={Walk_Anim} data={data} sprite={'idle'} />
  }
  }

  render() {
    // console.log(this.state.walking);
    const spriteStyle = {
              left:`${this.state.x}px`,
              marginTop:`${this.state.y}px`,
              transform:`rotate(${this.state.rotation}deg)`
            }
    const player = this.renderPlayer()

    return (
      <div className="player" style={spriteStyle}>
        {player}
      </div>
    )
  }
}

export default Player;
