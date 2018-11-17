import React from 'react';
import {SpriteSheet, AnimatedSpriteSheet} from 'react-spritesheet';
import Walk_Anim from "../Walk_Anim_bright.png";
import { connect } from 'react-redux';
import { updatePlayerPos, updatePlayerWalking, changeAmmoValue, changePlayerGun, readyNextLevel, updatePlayerLevelStatus } from '../actions';
import Bullet from './Bullet';
// import levelSelect from '../dependencies/levelSelect';

class Player extends React.Component {
  constructor(props) {
    super(props)
    this.keyState = {};
    this.bullets = {};
    this.bulletKey = 0;
  }
  componentDidMount() {
    window.addEventListener("keydown", this.handleKeyPress);
    window.addEventListener("keyup", this.stopKeyPress);
    this.playerLoopInterval = setInterval(this.movementLogic, 30);
    this.fireInterval = setInterval(this.fireGun, this.props.gun.rate);
    this.bulletLogicInterval = setInterval(this.bulletLogic, 30);
  }
  componentWillUnmount() {
    window.removeEventListener("keydown", this.handleKeyPress);
    window.removeEventListener("keyup", this.stopKeyPress);
    clearInterval(this.playerLoopInterval);
    clearInterval(this.fireInterval);
    clearInterval(this.bulletInterval);
  }
  componentDidUpdate(prevProps) {
    if (this.props.gun.type !== prevProps.gun.type) {
      clearInterval(this.fireInterval);
      this.fireInterval = setInterval(this.fireGun, this.props.gun.rate);
    } else if (this.props.levelId !== prevProps.levelId) {
      this.bullets = {};
    }
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

  movementLogic = () => {
    const { top, bottom, left, right } = this.props.levelBounds
    const oldX = this.props.positioning.x,
          oldY = this.props.positioning.y
    let { x, y, rotation, walking } = this.props.positioning
    const movespeed = 4;

    if (oldX >= 1184) {
      this.props.dispatch(
        readyNextLevel({levelId: this.props.levelId + 1, startingX: 753, startingY: 111})
      );
      this.props.dispatch( updatePlayerLevelStatus('active') );
    } else {
      //determine direction rotation and speed
      if (this.keyState['w']) {
        this.props.dispatch(updatePlayerWalking(true))
        rotation = 180;
        if (oldY <= top) {
          y = top;
        } else {
          y -= movespeed;
        }
      }
      if (this.keyState['s']) {
        this.props.dispatch(updatePlayerWalking(true))
        rotation = 0;
        if (y >= bottom) {
          y = bottom;
        } else {
          y += movespeed;
        }
      }
      if (this.keyState['a']) {
        this.props.dispatch(updatePlayerWalking(true))
        rotation = 90;
        if (oldX <= left) {
          x = left;
        } else {
          x -= movespeed;
        }
      }
      if (this.keyState['d']) {
        this.props.dispatch(updatePlayerWalking(true))
        rotation = 270;
        // Allows player exit on level clear
        if (oldX >= right && this.props.levelStatus !== 'clear') {
          x = right;
        } else {
          x += movespeed;
        }
      }

      // Prevents wall clipping on player exit
      if (x > right && (y < 103 || y > 118)) {
        y = oldY;
        x = oldX;
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
      rotation = 0;
    }
    else if (this.keyState['ArrowLeft']) {
      rotation = 90;
    }
    else if (this.keyState['ArrowRight']) {
      rotation = 270;
    }

    return rotation;
  }

  fireGun = () => {
    const { x, y, rotation } = this.props.positioning;

    if (this.keyState[' ']) {
      if (this.props.gun.ammo || this.props.gun.ammo === 0) {
        let ammo = this.props.gun.ammo;
        if (ammo > 0) {
          if (this.props.gun.type === 'shotgun') {
            this.shotgun();
          } else {
            this.bullets[++this.bulletKey] = {bulletKey: this.bulletKey, angle: rotation, x, y};
          }
          this.props.dispatch( changeAmmoValue(--ammo) );
        } else {
          this.props.dispatch( changePlayerGun({type: 'pistol', damage: 5, rate: 300}) );
        };
      } else {
        this.bullets[++this.bulletKey] = {bulletKey: this.bulletKey, angle: rotation, x, y};
      };
    };
  }

  shotgun = () => {
    const { x, y, rotation } = this.props.positioning;
    this.bullets[++this.bulletKey] = {bulletKey: this.bulletKey, angle: rotation-10, x, y};
    this.bullets[++this.bulletKey] = {bulletKey: this.bulletKey, angle: rotation, x, y};
    this.bullets[++this.bulletKey] = {bulletKey: this.bulletKey, angle: rotation+10, x, y};
  }

  bulletLogic = () => {
    const { top, bottom, left, right } = this.props.levelBounds
    console.log(this.props.levelBounds);

    for (let key in this.bullets) {
      const bullet = this.bullets[key]
      const angle = this.bullets[key].angle
      const bulletSpeed = 5;

      if (angle > 180 && angle < 360) {
        bullet.x += bulletSpeed;
      }
      if (angle > 0 && angle < 180) {
        bullet.x -= bulletSpeed;
      }
      if (angle > 270 || angle < 90) {
        bullet.y += bulletSpeed;
      }
      if (angle > 90 && angle < 270) {
        bullet.y -= bulletSpeed;
      }

      //calculate shotgun spread
      if ((angle === -10 || angle === 10) || (angle === 170)) {
        bullet.x += bulletSpeed/2;
      }
      if (angle === 190) {
        bullet.x -= bulletSpeed/2;
      }
      if (angle === 100 || angle === 260) {
        bullet.y += bulletSpeed/2;
      }
      if (angle === 80 || angle === 280) {
        bullet.y -= bulletSpeed/2;
      }
      //calculate for diagonals
      if (angle === 35 || angle === 235) {
        bullet.x += bulletSpeed/2;
        bullet.y += bulletSpeed/2;
      }
      if (angle === 55 || angle === 215) {
        bullet.x -= bulletSpeed/2;
        bullet.y -= bulletSpeed/2;
      }
      if (angle === 125 || angle === 325) {
        bullet.x -= bulletSpeed/2;
        bullet.y += bulletSpeed/2;
      }
      if (angle === 145 || angle === 305) {
        bullet.x += bulletSpeed/2;
        bullet.y -= bulletSpeed/2;
      }

      // remove out of bounds bullets
      if (bullet.x < (left-10) || bullet.x > (right+12)) {
        this.removeBullet(key)
      }
      if (bullet.y < (top-10) || bullet.y > (bottom+10)) {
        this.removeBullet(key)
      }
    }
  }

  removeBullet = (key) => {
    delete this.bullets[key];
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

    if (this.props.health <= 0 && this.props.lives === 0) {
      window.removeEventListener('keydown', this.handleKeyPress)
    } else if (this.props.positioning.walking) {
      return <AnimatedSpriteSheet
        filename={Walk_Anim}
        initialFrame={0}
        frame={{ width: 17, height: 24 }}
        bounds={{ x: 0, y: 0, width: 32, height: 24 }}
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
        <Bullet key={key} removeBullet={this.removeBullet} {...this.bullets[key]} />
      )
    }
    if (bullets.length > 30) {
      bullets.length = 30;
    }
    return bullets
  }

  render() {
    const { x, y, rotation, walking } = this.props.positioning
    const spriteStyle = {
              left:`${x}px`,
              top:`${y}px`,
              transform:`rotate(${rotation}deg)`
            }
    const player = this.renderPlayer()
    const bullets = this.renderBullets()

    return (
      <div>

        <div className="bullets">
          {bullets}
        </div>
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
    lives: state.player.lives,
    gun: state.player.gun,
    positioning: state.player.positioning,
    levelId: state.level.levelId,
    levelBounds: state.level.bounds,
    levelStatus: state.player.levelStatus,
  }
}

export default connect(mapStateToProps)(Player);
