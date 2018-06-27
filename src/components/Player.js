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
    let { x, y, rotation, walking } = this.props.positioning
    const { top, bottom, left, right } = this.props.levelBounds

    if (this.keyState['w'] || this.keyState['ArrowUp']) {
      this.props.dispatch(updatePlayerWalking(true))
      rotation = 180;
      if (this.props.positioning.y <= top) {
        y = top;
      } else {
        y -= 4;
      }
    }
    if (this.keyState['s'] || this.keyState['ArrowDown']) {
      this.props.dispatch(updatePlayerWalking(true))
      rotation = 360;
      if (this.props.positioning.y >= bottom) {
        y = bottom;
      } else {
        y += 4;
      }
    }
    if (this.keyState['a'] || this.keyState['ArrowLeft']) {
      this.props.dispatch(updatePlayerWalking(true))
      rotation = 90;
      if (this.props.positioning.x <= left) {
        x = left;
      } else {
        x -= 4;
      }
    }
    if (this.keyState['d'] || this.keyState['ArrowRight']) {
      this.props.dispatch(updatePlayerWalking(true))
      rotation = 270;
      if (this.props.positioning.x >= right) {
        x = right;
      } else {
        x += 4;
      }
    }

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
      <div className="player" style={spriteStyle}>
        {player}
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
