import React, { Component } from 'react';
import { connect } from 'react-redux';
import { SpriteSheet } from 'react-spritesheet';
import Pickups from '../Pickups.png'
import pickupSprites from '../adapters/pickupSpriteConfig'

class PointsPickup extends Component {
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
      this.props.pickupPoints(this, 'points');
    };
  }

  renderPickup = () => {
    const derenderPickup = () => {this.props.derenderPickup(this.props.pickupId)}
    setTimeout(derenderPickup, 6000)

    return <SpriteSheet  filename={Pickups} data={pickupSprites} sprite={'points'} />
  }

  render() {
    const spriteStyle = {
      marginLeft: `${this.props.x}px`,
      marginTop: `${this.props.y}px`,
    }
    const pickup = this.renderPickup();

    return (
      <div className='pickup' style={spriteStyle}>
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

export default connect(mapStateToProps)(PointsPickup);
