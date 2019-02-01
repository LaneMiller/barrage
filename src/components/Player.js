import React from 'react';
import {SpriteSheet, AnimatedSpriteSheet} from 'react-spritesheet';
import Walk_Anim from "../Walk_Anim_bright.png";
import { connect } from 'react-redux';
import { changeGameStatus, updatePlayerPos, updatePlayerWalking, changeAmmoValue, changePlayerGun, readyNextLevel, updatePlayerLevelStatus } from '../actions';
import Bullet from './Bullet';
import fetchAdapter from '../adapters/fetchAdapter'

class Player extends React.Component {
  constructor(props) {
    super(props)
    this.keyState = {};
    this.bullets = [];
    this.bulletId = 0;
  }
  componentDidMount() {
    window.addEventListener("resize", this.adjustPosition);
    window.addEventListener("keydown", this.handleKeyPress);
    window.addEventListener("keyup", this.stopKeyPress);
    this.playerLoopInterval = setInterval(this.movementLogic, 30);
    this.fireInterval = setInterval(this.fireGun, this.props.gun.rate);
    this.bulletLogicInterval = setInterval(this.bulletLogic, 30);
  }
  componentWillUnmount() {
    window.removeEventListener("resize", this.adjustPosition);
    window.removeEventListener("keydown", this.handleKeyPress);
    window.removeEventListener("keyup", this.stopKeyPress);
    clearInterval(this.playerLoopInterval);
    clearInterval(this.fireInterval);
    clearInterval(this.bulletLogicInterval);
  }
  componentDidUpdate(prevProps) {
    if (this.props.gun.type !== prevProps.gun.type) {
      clearInterval(this.fireInterval);
      this.fireInterval = setInterval(this.fireGun, this.props.gun.rate);
    } else if (this.props.levelId !== prevProps.levelId) {
      this.bullets = [];
      this.autosave();
    }

    if (this.props.levelBounds.bottom !== prevProps.levelBounds.bottom) {
      // Updates Player position relative to new window size
      const { x, y } = this.props.positioning;

      const xPercentage = x/prevProps.levelBounds.right;
      const yPercentage = y/prevProps.levelBounds.bottom;

      const newX = xPercentage * this.props.levelBounds.right;
      const newY = yPercentage * this.props.levelBounds.bottom;

      this.props.dispatch(updatePlayerPos({x: newX, y: newY}));
    }
  }

  autosave = () => {
    fetchAdapter.savePlayer(this.props.player, this.props.levelId)
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
    const { top, bottom, left, right } = this.props.levelBounds;
    const entranceXY = this.props.entrances.left;
    const exitXY = this.props.entrances.right;

    const oldX = this.props.positioning.x,
          oldY = this.props.positioning.y;
    let { x, y, rotation } = this.props.positioning;
    const movespeed = 7;

    if (oldX > exitXY[0]+50) {
      const nextLevelId = this.props.levelId + 1

      if (!this.props.levelSelect[nextLevelId]) {
        this.props.dispatch( changeGameStatus('win') );
      } else {
        this.props.dispatch(
          readyNextLevel({
            levelId: nextLevelId,
            level: {...this.props.levelSelect[nextLevelId]},
            startingX: entranceXY[0],
            startingY: entranceXY[1],
          })
        );
        this.props.dispatch( updatePlayerLevelStatus('active') );
      }
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
        if (x + movespeed >= right && this.props.levelStatus !== 'clear') {
          x = right;
        } else {
          x += movespeed;
        }
      }

      // Prevents wall clipping on player exit
      if (x > right && (y < exitXY[1] - 20 || y > exitXY[1] + 20)) {
        // y = oldY;
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
      if (this.bullets.length >= 30) {
        this.bullets.length = 30;
      }

      if (this.props.gun.ammo || this.props.gun.ammo === 0) {
        let ammo = this.props.gun.ammo;
        if (ammo > 0) {
          if (this.props.gun.type === 'shotgun') {
            this.shotgun();
          } else {
            this.bullets.unshift({id: ++this.bulletId, angle: rotation, x, y})
          }
          this.props.dispatch( changeAmmoValue(--ammo) );
        } else {
          this.props.dispatch( changePlayerGun({type: 'pistol', damage: 5, rate: 300}) );
        };
      } else {
        this.bullets.unshift({id: ++this.bulletId, angle: rotation, x, y})
      };
    };
  }

  shotgun = () => {
    const { x, y, rotation } = this.props.positioning;
    this.bullets.unshift({id: ++this.bulletId, angle: rotation-10, x, y});
    this.bullets.unshift({id: ++this.bulletId, angle: rotation, x, y});
    this.bullets.unshift({id: ++this.bulletId, angle: rotation+10, x, y});
  }

  bulletLogic = () => {
    const { top, bottom, left, right } = this.props.levelBounds
    const outOfBoundsIds = [];

    for (let i in this.bullets) {
      const bullet = this.bullets[i]
      const angle = bullet.angle
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
      const xBounds = bullet.x < (left-10) || bullet.x > (right+10)
      const yBounds = bullet.y < (top-10) || bullet.y > (bottom+10)
      if (xBounds || yBounds) {
        outOfBoundsIds.push(bullet.id)
      }
    }
    outOfBoundsIds.forEach(id => this.removeBullet(id))
  }

  removeBullet = (id) => {
    this.bullets = this.bullets.filter(b => b.id !== id)
  }

  renderPlayer = () => {
    const { health, lives } = this.props.player;
    const idleSprite = {
      idle: {
        x: 0,
        y: 0,
        width: 17,
        height: 24,
      }
    }

    if (health <= 0 && lives === 0) {
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
    let bullets = this.bullets.map( bullet => (
      <Bullet key={bullet.id} removeBullet={this.removeBullet} {...bullet} />
    ))

    // if (bullets.length > 30) {
    //   bullets.length = 30;
    // }
    return bullets;
  }

  render() {
    const { x, y, rotation } = this.props.positioning;

    const playAreaWidth = this.props.playArea.width;
    const scale = playAreaWidth/402; // Current Width/1:1 width

    const spriteStyle = {
              top:`${y}px`,
              left:`${x}px`,
              height: `24px`,
              width: `17px`,
              transform:`rotate(${rotation}deg) scale(${scale})`,
            }
    const player = this.renderPlayer()
    const bullets = this.renderBullets()

    return (
      <div className="player-container">
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
    player: state.player,
    gun: state.player.gun,
    positioning: state.player.positioning,
    levelSelect: state.levelSelect,
    levelId: state.level.levelId,
    playArea: state.playArea,
    entrances: state.entrances,
    levelBounds: state.level.bounds,
    levelStatus: state.player.levelStatus,
  }
}

export default connect(mapStateToProps)(Player);
