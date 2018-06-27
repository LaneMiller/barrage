import React, { Component } from 'react';
import { connect } from 'react-redux'
import { damagePlayer } from '../actions'

class Enemy extends Component {
  componentDidMount() {
    this.interval = setInterval(this.checkCollision, 100)
  }

  componentWillUnmount() {
    clearInterval(this.interval)
  }

  checkCollision = () => {
    const { height, width } = this.props.positioning;
    const { x, y } = this.props;
    const xBounds = ((x + width/2) >= this.props.playerX && (x + width/2) <= (this.props.playerX + 17))
    const yBounds = ((y + height/2) >= this.props.playerY && (y + height/2) <= (this.props.playerY + 24))

    if (xBounds && yBounds) {
      console.log("hit!");
      this.props.dispatch(damagePlayer(this.props.damage))
    }
  }

  render() {
    const { height, width } = this.props.positioning;
    const { x, y } = this.props;
    const spriteStyle = {
      height: `${height}px`,
      width: `${width}px`,
      left: `${x}px`,
      marginTop: `${y}px`,
    };

    return (
      <div className="enemy" style={spriteStyle}>
        <xSmall>{this.props.health}</xSmall>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    positioning: state.enemy.positioning,
    levelBounds: state.level.bounds,
    playerX: state.player.positioning.x,
    playerY: state.player.positioning.y,
  }
}

export default connect(mapStateToProps)(Enemy);
