import React, { Component } from 'react';
import { connect } from 'react-redux'

class Enemy extends Component {
  componentDidMount() {
    this.interval = setInterval(this.checkCollision, 20)
  }

  componentWillUnmount() {
    clearInterval(this.interval)
  }

  checkCollision = () => {
    const { height, width, x, y } = this.props.positioning
    const xBounds = ((x + width/2) >= this.props.playerX && (x + width/2) <= (this.props.playerX + 17))
    const yBounds = ((y + height/2) >= this.props.playerY && (y + height/2) <= (this.props.playerY + 24))

    if (xBounds && yBounds) {
      console.log("hit!");
    }
  }

  render() {
    const { height, width, x, y } = this.props.positioning
    const spriteStyle = {
      height: `${height}px`,
      width: `${width}px`,
      left: `${x}px`,
      marginTop: `${y}px`,
    }

    return (
      <div className="enemy" style={spriteStyle}>
        <xSmall>{this.props.health}</xSmall>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    health: state.enemy.health,
    positioning: state.enemy.positioning,
    levelBounds: state.level.bounds,
    playerX: state.player.positioning.x,
    playerY: state.player.positioning.y,
  }
}

export default connect(mapStateToProps)(Enemy);
