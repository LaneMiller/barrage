import React, { Component } from 'react';
import { connect } from 'react-redux'
import { damagePlayer, updateEnemyPos } from '../actions'

class Enemy extends Component {
  componentDidMount() {
    this.interval = setInterval(this.enemyCycle, 100)
  }

  componentWillUnmount() {
    clearInterval(this.interval)
  }

  enemyCycle = () => {
    this.checkCollision()
    this.movementLogic()
  }

  checkCollision = () => {
    const { height, width, x, y } = this.props;
    const xBounds = ((x + width/2) >= this.props.playerX && (x + width/2) <= (this.props.playerX + 17))
    const yBounds = ((y + height/2) >= this.props.playerY && (y + height/2) <= (this.props.playerY + 24))

    if (xBounds && yBounds) {
      console.log("hit!");
      this.props.dispatch(damagePlayer(this.props.damage))
    }
  }

  movementLogic = () => {
    const { top, bottom, left, right } = this.props.levelBounds;
    const { playerX, playerY } = this.props
    let x = this.props.x,
        y = this.props.y,
        rotation = this.props.rotation
    const movespeed = 4;

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

    // if (this.props.type = 'patroller') {
    //
    // }

    // determine diagonal rotations
    if (x !== this.props.x && y !== this.props.y) {
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

    // this.props.dispatch(updateEnemyPos({[this.props.mobId]: {...this.props, x, y, rotation}}));
  }

  render() {
    const { height, width, x, y, rotation } = this.props;
    const spriteStyle = {
      height: `${height}px`,
      width: `${width}px`,
      left: `${x}px`,
      marginTop: `${y}px`,
      transform: `rotate(${rotation}deg)`,
    };

    return (
      <div className="enemy" style={spriteStyle}>
        <xsmall>{this.props.health}</xsmall>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    levelBounds: state.level.bounds,
    playerX: state.player.positioning.x,
    playerY: state.player.positioning.y,
  }
}

export default connect(mapStateToProps)(Enemy);
