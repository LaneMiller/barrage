import React, { Component } from 'react';
import { connect } from 'react-redux';
import { SpriteSheet } from 'react-spritesheet';
import HealthKit from '../HealthKit.png'

class HealthPickup extends Component {
  componentDidMount() {
    this.interval = setInterval(this.checkCollision, 20);
  }
  componentWillUnmount() {
    clearInterval(this.interval);
  }

  checkCollision = () => {
    const x = this.props.x;
    const y = this.props.y;
    const xBounds = ((this.props.playerX + 17/2) >= x && this.props.playerX <= (x + 23));
    const yBounds = ((this.props.playerY + 24/2) >= y && this.props.playerY <= (y + 20));

    if (xBounds && yBounds) {
      this.props.pickupHealth(this, 'health');
    };
  }

  renderPickup = () => {
    const derenderPickup = () => {this.props.derenderPickup(this.props.pickupId)}
    // setTimeout(derenderPickup, 6000)

    const healthSprite = {
      health: {
        x: 0,
        y: 0,
        width: 38,
        height: 33,
      }
    }

    return <SpriteSheet  filename={HealthKit} data={healthSprite} sprite={'health'} />
  }

  render() {
    const spriteStyle = {
      marginLeft: `${this.props.x}px`,
      marginTop: `${this.props.y}px`,
    }
    const pickup = this.renderPickup();

    return (
      <div className='health-pickup' style={spriteStyle}>
        {pickup}
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    playerX: state.player.positioning.x,
    playerY: state.player.positioning.y,
    levelBounds: state.level.bounds,
  };
}

export default connect(mapStateToProps)(HealthPickup);
