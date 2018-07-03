import React, { Component } from 'react';
import { connect } from 'react-redux';
import { SpriteSheet } from 'react-spritesheet'
import Gun_Icons from '../Gun_Icons.png'

class GunPickup extends Component {
  componentDidMount() {
    this.interval = setInterval(this.checkCollision, 20);
  }
  componentWillUnmount() {
    clearInterval(this.interval);
  }

  checkCollision = () => {
    const xBounds = ((this.props.playerX + 17/2) >= this.props.x && this.props.playerX <= (this.props.x + 29.4));
    const yBounds = ((this.props.playerY + 24/2) >= this.props.y && this.props.playerY <= (this.props.y + 6.6));

    if (xBounds && yBounds) {
      this.props.pickupGun(this, 'gun')
    };
  }

  renderPickup = () => {
    const gunSprites = {
      shotgun: {
        x: 0,
        y: 0,
        width: 98,
        height: 22,
      },
    }

    return <SpriteSheet  filename={Gun_Icons} data={gunSprites} sprite={this.props.type} />
  }

  render() {
    const spriteStyle = {
      marginLeft: `${this.props.x}px`,
      marginTop: `${this.props.y}px`,
    }
    const pickup = this.renderPickup();

    return(
      <React.Fragment>
        <div style={{position: 'absolute', height: '6.6px', width: '29.4px', marginLeft: `${this.props.x}px`, marginTop: `${this.props.y}px`, backgroundColor: 'red'}}>
        </div>
        <div style={{position: 'absolute', height: '24px', width: '17px', marginLeft: `${this.props.playerX}px`, marginTop: `${this.props.playerY}px`, backgroundColor: 'red'}}>
        </div>

        <div className='gun-pickup' style={spriteStyle}>
          {pickup}
        </div>
      </React.Fragment>
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

export default connect(mapStateToProps)(GunPickup);
