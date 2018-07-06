import React, { Component } from 'react';
import { connect } from 'react-redux';
import { SpriteSheet } from 'react-spritesheet';
import Gun_Icons from '../Gun_Icons.png';
import gunSprites from '../adapters/gunSpriteConfig'

class GunPickup extends Component {
  componentDidMount() {
    this.interval = setInterval(this.checkCollision, 20);
  }
  componentWillUnmount() {
    clearInterval(this.interval);
  }

  checkCollision = () => {
    const x = this.props.x + 35;
    const y = this.props.y + 7;
    const xBounds = ((this.props.playerX + 17/2) >= x && this.props.playerX <= (x + 29.4));
    const yBounds = ((this.props.playerY + 24/2) >= y && this.props.playerY <= (y + 6.6));

    if (xBounds && yBounds) {
      this.props.pickupGun(this, 'gun');
    };
  }

  renderPickup = () => {
    const derenderPickup = () => {this.props.derenderPickup(this.props.pickupId)}
    setTimeout(derenderPickup, 6000)

    return <SpriteSheet  filename={Gun_Icons} data={gunSprites} sprite={this.props.type} />
  }

  render() {
    const spriteStyle = {
      marginLeft: `${this.props.x}px`,
      marginTop: `${this.props.y}px`,
    }
    const pickup = this.renderPickup();

    return (
      <div className='gun-pickup' style={spriteStyle}>
        {pickup}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    playerX: state.player.positioning.x,
    playerY: state.player.positioning.y,
    levelBounds: state.level.bounds,
  };
}

export default connect(mapStateToProps)(GunPickup);
