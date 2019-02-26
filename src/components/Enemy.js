import React, { Component } from 'react';
import { connect } from 'react-redux'
import { damagePlayer, updatePlayerValue, updateEnemyPos, increaseKillScore } from '../actions'
import {AnimatedSpriteSheet} from 'react-spritesheet'
import Zombie_Anim from '../dependencies/imgs/Zombie_Anim.png'
import Zombie_Anim_Purple from '../dependencies/imgs/Zombie_Anim_Purple.png'

class Enemy extends Component {
  state = {
    maxHealth: this.props.health
  }

  componentDidMount() {
    // These are seperate so that only collision can be disabled
    // on player respawn.
    window.addEventListener("resize", this.adjustPosition);
    this.collisionInterval = setInterval(this.checkCollision, 100)
    this.movementInterval = setInterval(this.movementLogic, 100)
    this.deathInterval = setInterval(this.checkIfDead, 100)
  }
  componentWillUnmount() {
    window.removeEventListener("resize", this.adjustPosition);
    clearInterval(this.collisionInterval);
    clearInterval(this.movementInterval);
    clearInterval(this.deathInterval);
  }
  componentDidUpdate(prevProps) {
    if (prevProps.playerLives !== this.props.playerLives) {
      clearInterval(this.collisionInterval);
      const restartCollision = () => {
        this.collisionInterval = setInterval(this.checkCollision, 100);
      }
      setTimeout(restartCollision, 1000);
    }

    if (this.props.levelBounds.bottom !== prevProps.levelBounds.bottom) {
      // Updates Enemy position relative to new window size
      const { mobId, x, y } = this.props;

      const xPercentage = x/prevProps.levelBounds.right;
      const yPercentage = y/prevProps.levelBounds.bottom;

      const newX = xPercentage * this.props.levelBounds.right;
      const newY = yPercentage * this.props.levelBounds.bottom;

      this.props.dispatch(
        updateEnemyPos({[mobId]: {...this.props, x: newX, y: newY}})
      );
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

    const playerX = Math.floor(this.props.playerX),
          playerY = Math.floor(this.props.playerY);

    let x = Math.floor(this.props.x),
        y = Math.floor(this.props.y),
        rotation = this.props.rotation;

    const movespeed = this.props.speed;
    // if monster's x !== player's x,
    // either move towards player at movespeed, or make up difference
    if (x !== playerX) {
      const difference = Math.abs(x - playerX)
      if (x < playerX) {
        x = movespeed < difference ? x + movespeed : x + difference;
      } else {
        x = movespeed < difference ? x - movespeed : x - difference;
      }
    }
    if (y !== playerY) {
      const difference = Math.abs(y - playerY)
      if (y < playerY) {
        y = movespeed < difference ? y + movespeed : y + difference;
      } else {
        y = movespeed < difference ? y - movespeed : y - difference;
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


    // if moving horizontally
    if (x !== this.props.x) {
      // if moving right
      if (x > this.props.x) {
        rotation = 270;
      // if moving left
      } else {
        rotation = 90;
      }
    }
    // if moving vertically
    if (y !== this.props.y) {
      // if moving down
      if (y > this.props.y) {
        rotation = 0;
      // if moving up
      } else {
        rotation = 180;
      }
    }

    // determine diagonal rotations
    // if moving both horizontally && vertically
    if (x !== this.props.x && y !== this.props.y) {
      // if moving right && up
      if (x > this.props.x && y < this.props.y) {
        rotation = 225;
      }
      // if moving right && down
      else if (x > this.props.x && y > this.props.y) {
        rotation = 315;
      }
      // if moving left && up
      else if (x < this.props.x && y < this.props.y) {
        rotation = 135;
      }
      // if moving left && down
      else if (x < this.props.x && y > this.props.y) {
        rotation = 45;
      }
    }

    this.props.dispatch(
      updateEnemyPos({[this.props.mobId]: {...this.props, x, y, rotation}})
    );
  }

  checkIfDead = () => {
    if (this.props.health <= 0) {
      this.props.removeEnemy(this.props.mobId);
      this.props.dispatch(
        increaseKillScore(this.props.points)
      );
    }
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

    const playAreaWidth = this.props.playArea.width;
    const scale = playAreaWidth/402; // Current Width/1:1 width

    const healthStyle = { width: `${healthBar}px` };
    const spriteStyle = {
      height: `${height}px`,
      width: `${width}px`,
      left: `${x}px`,
      top: `${y}px`,
      transform: `rotate(${rotation}deg) scale(${scale})`,
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
    enemies: state.level.enemies,
    playArea: state.playArea,
    levelBounds: state.level.bounds,
    playerHealth: state.player.health,
    playerLives: state.player.lives,
    playerX: state.player.positioning.x,
    playerY: state.player.positioning.y,
  }
}

export default connect(mapStateToProps)(Enemy);
