import React, { Component } from 'react';
import { connect } from 'react-redux'
import { damagePlayer, updatePlayerValue, updateEnemyPos } from '../actions'
import {SpriteSheet, AnimatedSpriteSheet} from 'react-spritesheet'
import Zombie_Anim from '../Zombie_Anim.png'
import Zombie_Anim_Purple from '../Zombie_Anim_Purple.png'

class Enemy extends Component {
  state = {
    maxHealth: this.props.health
  }

  componentDidMount() {
    // These are seperate so that only collision can be disabled
    // on player respawn.
    this.collisionInterval = setInterval(this.checkCollision, 100)
    this.movementInterval = setInterval(this.movementLogic, 100)
  }
  componentWillUnmount() {
    clearInterval(this.collisionInterval);
    clearInterval(this.movementInterval);
  }
  componentDidUpdate(prevProps) {
    if (prevProps.playerLives !== this.props.playerLives) {
      clearInterval(this.collisionInterval);
      const restartCollision = () => {
        this.collisionInterval = setInterval(this.checkCollision, 100);
      }
      setTimeout(restartCollision, 1000);
    }
  }

  checkCollision = () => {
    const { height, width, x, y } = this.props;
    const xBounds = ((x + width/2) >= this.props.playerX && (x + width/2) <= (this.props.playerX + 17));
    const yBounds = ((y + height/2) >= this.props.playerY && (y + height/2) <= (this.props.playerY + 24));

    if (xBounds && yBounds) {
      const { damage, playerHealth, playerLives } = this.props;

      this.props.dispatch(damagePlayer(damage));

      if (playerHealth - damage <= 0 && playerLives !== 0) {
        this.props.dispatch( updatePlayerValue({
          lives: this.props.playerLives - 1,
          health: 100
        }) );
      }
    }
  }

  movementLogic = () => {
    const { top, bottom, left, right } = this.props.levelBounds;
    const { playerX, playerY } = this.props;
    let x = this.props.x,
        y = this.props.y,
        rotation = this.props.rotation;
    const movespeed = this.props.speed;

    if (x !== playerX) {
      if (x < playerX) {
        x += movespeed;
      } else {
        x -= movespeed;
      }
    }
    if (y !== playerY) {
      if (y < playerY) {
        y += movespeed;
      } else {
        y -= movespeed;
      }
    }

    //keep enemies within level bounds
    if (x <= left) {
      x = left;
    } else if (x >= right) {
      x = right;
    } else if (y <= top) {
      y = top;
    } else if (y >= bottom) {
      y = bottom;
    }

    if (x !== this.props.x) {
      if (x > this.props.x) {
        rotation = 270;
      } else {
        rotation = 90;
      }
    }
    if (y !== this.props.y) {
      if (y > this.props.y) {
        rotation = 0;
      } else {
        rotation = 180;
      }
    }
    // determine diagonal rotations
    if ((x !== this.props.x && y !== this.props.y) && y !== playerY) {
      if (x > this.props.x && y < this.props.y) {
        rotation = 225;
      }
      if (x > this.props.x && y > this.props.y) {
        rotation = 315;
      }
      if (x < this.props.x && y < this.props.y) {
        rotation = 135;
      }
      if (x < this.props.x && y > this.props.y) {
        rotation = 45;
      }
    }

    if (Math.abs(this.props.rotation - rotation) === 90) {
      if (this.props.rotation > rotation) {
        rotation += 45;
      } else {
        rotation -= 45;
      }
    }

    this.props.dispatch( updateEnemyPos({[this.props.mobId]: {...this.props, x, y, rotation}}) );
  }

  renderEnemy = () => {
    let zed_anim;
    if (this.props.type === 'green') {
      zed_anim = Zombie_Anim;
    } else {
      zed_anim = Zombie_Anim_Purple;
    }
    return <AnimatedSpriteSheet
      filename={zed_anim}
      initialFrame={0}
      frame={{ width: 13, height: 24 }}
      bounds={{ x: 0, y: 0, width: 78, height: 24 }}
      isPlaying
      loop
      speed={150}
    />
  }

  render() {
    const enemy = this.renderEnemy();
    const { height, width, x, y, rotation } = this.props;
    const healthBar = this.props.width * (this.props.health/this.state.maxHealth);
    const healthStyle = { width: `${healthBar}px` };
    const spriteStyle = {
      height: `${height}px`,
      width: `${width}px`,
      left: `${x}px`,
      marginTop: `${y}px`,
      transform: `rotate(${rotation}deg)`,
    };

    return (
      <div className="enemy" style={spriteStyle}>
        <div className='health-bar' style={healthStyle}></div>
        {enemy}
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    levelBounds: state.level.bounds,
    playerHealth: state.player.health,
    playerLives: state.player.lives,
    playerX: state.player.positioning.x,
    playerY: state.player.positioning.y,
  }
}

export default connect(mapStateToProps)(Enemy);
