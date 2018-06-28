import React from 'react';
import {SpriteSheet, AnimatedSpriteSheet} from 'react-spritesheet'
import Walk_Anim from "../Walk_Anim.png"
import { connect } from 'react-redux'
import { updatePlayerPos, updatePlayerWalking } from '../actions'

class Player extends React.Component {
  componentDidMount() {
    this.keyState = {}
    window.addEventListener("keydown", this.handleMovement)
    window.addEventListener("keyup", this.stopMovement)
    this.interval = setInterval(this.movementLogic, 20)
  }

  componentWillUnmount() {
    clearInterval(this.interval)
  }

  handleMovement = (e) => {
    this.keyState[e.key] = true;
  }

  stopMovement = (e) => {
    this.keyState[e.key] = false;
    this.stopSprite()
  }

  stopSprite = () => {
    this.props.dispatch(updatePlayerWalking(false))
  }

  movementLogic = () => {
    const { top, bottom, left, right } = this.props.levelBounds
    const oldX = this.props.positioning.x,
          oldY = this.props.positioning.y
    let { x, y, rotation, walking } = this.props.positioning

    //determine direction rotation and speed
    if (this.keyState['w']) {
      this.props.dispatch(updatePlayerWalking(true))
      if (oldY <= top) {
        y = top;
      } else {
        y -= 4;
      }
    }
    if (this.keyState['s']) {
      this.props.dispatch(updatePlayerWalking(true))
      if (oldY >= bottom) {
        y = bottom;
      } else {
        y += 4;
      }
    }
    if (this.keyState['a']) {
      this.props.dispatch(updatePlayerWalking(true))
      if (oldX <= left) {
        x = left;
      } else {
        x -= 4;
      }
    }
    if (this.keyState['d']) {
      this.props.dispatch(updatePlayerWalking(true))
      if (oldX >= right) {
        x = right;
      } else {
        x += 4;
      }
    }

    if (this.keyState['ArrowUp'] && this.keyState['ArrowLeft']){
      rotation = 135;
    }
    else if (this.keyState['ArrowUp'] && this.keyState['ArrowRight']){
      rotation = 225;
    }
    else if (this.keyState['ArrowDown'] && this.keyState['ArrowLeft']){
      rotation = 45;
    }
    else if (this.keyState['ArrowDown'] && this.keyState['ArrowRight']){
      rotation = 315;
    }
    else if (this.keyState['ArrowUp']) {
      rotation = 180;
    }
    else if (this.keyState['ArrowDown']) {
      rotation = 360;
    }
    else if (this.keyState['ArrowLeft']) {
      rotation = 90;
    }
    else if (this.keyState['ArrowRight']) {
      rotation = 270;
    }

    // old movement based rotation logic
    // if (x !== oldX && y !== oldY) {
    //   if (x > oldX && y < oldY) {
    //     rotation = 225;
    //   }
    //   if (x > oldX && y > oldY) {
    //     rotation = 315;
    //   }
    //   if (x < oldX && y < oldY) {
    //     rotation = 135;
    //   }
    //   if (x < oldX && y > oldY) {
    //     rotation = 45;
    //   }
    // }

    this.props.dispatch(updatePlayerPos({x, y, rotation}));
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
    if (this.props.positioning.walking) {
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
    const { x, y, rotation, walking } = this.props.positioning
    const spriteStyle = {
              left:`${x}px`,
              marginTop:`${y}px`,
              transform:`rotate(${rotation}deg)`
            }
    const player = this.renderPlayer()

    return (
      <div>
        <xsmall id="player-health">{this.props.health}</xsmall>
        <div className="player" style={spriteStyle}>
          {player}
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    health: state.player.health,
    positioning: state.player.positioning,
    levelBounds: state.level.bounds,
  }
}

export default connect(mapStateToProps)(Player);
