import React from 'react';
import {SpriteSheet, AnimatedSpriteSheet} from 'react-spritesheet'
import Walk_Anim from "../Walk_Anim.png"
import { connect } from 'react-redux'
import { updatePlayerPos, updatePlayerWalking } from '../actions'
import Bullet from './Bullet'

class Player extends React.Component {
  constructor(props) {
    super(props)
    this.keyState = {};
    this.bullets = {};
    this.bulletKey = 1;
  }

  componentDidMount() {
    window.addEventListener("keydown", this.handleKeyPress)
    window.addEventListener("keyup", this.stopKeyPress)
    this.playerLoopInterval = setInterval(this.playerLoop, 30)
    this.bulletInterval = setInterval(this.bulletLogic, 100)
  }

  componentWillUnmount() {
    clearInterval(this.playerLoopInterval)
    clearInterval(this.bulletInterval)
  }

  handleKeyPress = (e) => {
    this.keyState[e.key] = true;
  }

  stopKeyPress = (e) => {
    this.keyState[e.key] = false;
    this.stopSprite()
  }

  stopSprite = () => {
    this.props.dispatch(updatePlayerWalking(false))
  }

  playerLoop = () => {
    this.movementLogic()
  }

  movementLogic = () => {
    const { top, bottom, left, right } = this.props.levelBounds
    const oldX = this.props.positioning.x,
          oldY = this.props.positioning.y
    let { x, y, rotation, walking } = this.props.positioning

    //determine direction rotation and speed
    if (this.keyState['w']) {
      this.props.dispatch(updatePlayerWalking(true))
      rotation = 180;
      if (oldY <= top) {
        y = top;
      } else {
        y -= 4;
      }
    }
    if (this.keyState['s']) {
      this.props.dispatch(updatePlayerWalking(true))
      rotation = 0;
      if (oldY >= bottom) {
        y = bottom;
      } else {
        y += 4;
      }
    }
    if (this.keyState['a']) {
      this.props.dispatch(updatePlayerWalking(true))
      rotation = 90;
      if (oldX <= left) {
        x = left;
      } else {
        x -= 4;
      }
    }
    if (this.keyState['d']) {
      this.props.dispatch(updatePlayerWalking(true))
      rotation = 270;
      if (oldX >= right) {
        x = right;
      } else {
        x += 4;
      }
    }

    // movement based diagonal rotations
    if (x !== oldX && y !== oldY) {
      if (x > oldX && y < oldY) {
        rotation = 225;
      }
      if (x > oldX && y > oldY) {
        rotation = 315;
      }
      if (x < oldX && y < oldY) {
        rotation = 135;
      }
      if (x < oldX && y > oldY) {
        rotation = 45;
      }
    }

    // override rotation with arrow keys
    rotation = this.aimingLogic(rotation)

    this.props.dispatch(updatePlayerPos({x, y, rotation}));
  }

  aimingLogic = (rotation) => {
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

    return rotation;
  }

  bulletLogic = () => {
    this.fireGun()
    const { top, bottom, left, right } = this.props.levelBounds

    for (let key in this.bullets) {
      const bullet = this.bullets[key]
      const angle = this.bullets[key].angle

      if (angle === 225 || (angle === 270 || angle === 315)) {
        bullet.x += 3;
      }
      if (angle === 45 || (angle === 90 || angle === 135)) {
        bullet.x -= 3;
      }
      if (angle === 0 || (angle === 45 || angle === 315)) {
        bullet.y += 3;
      }
      if (angle === 135 || (angle === 180 || angle === 225)) {
        bullet.y -= 3;
      }

      if (bullet.x <= left || bullet.x >= right) {
        delete this.bullets[key];
      }
      if (bullet.y <= top || bullet.y >= bottom) {
        delete this.bullets[key];
      }

    }
  }

  fireGun = () => {
    const { x, y, rotation } = this.props.positioning;
    if (this.keyState[' ']) {
      this.bullets[this.bulletKey++] = {angle: rotation, x, y};
    }
  }

  renderPlayer = () => {
    const idleSprite = {
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
    return <SpriteSheet filename={Walk_Anim} data={idleSprite} sprite={'idle'} />
  }
  }

  renderBullets = () => {
    let bullets = []
    for (let key in this.bullets) {
      bullets.push(
        <Bullet key={key} {...this.bullets[key]} />
      )
    }
    if (bullets.length > 10) {
      bullets.length = 10;
    }
    return bullets
  }

  render() {
    const { x, y, rotation, walking } = this.props.positioning
    const spriteStyle = {
              left:`${x}px`,
              marginTop:`${y}px`,
              transform:`rotate(${rotation}deg)`
            }
    const player = this.renderPlayer()
    const bullets = this.renderBullets()

    return (
      <div>
        <xsmall id="player-health">{this.props.health}</xsmall>
        <div className="player" style={spriteStyle}>
          {player}
        </div>
        <div className="bullets">
          {bullets}
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
