import React, { Component } from 'react';
import { connect } from 'react-redux';
import { SpriteSheet } from 'react-spritesheet'
import BossSprite from '../Boss.png'

class Boss extends Component {
  state = {
    maxHealth: this.props.health
  }

  spriteConfig = () => {
    return {
      boss: {
        x: 0,
        y: 0,
        width: 63,
        height: 98,
      }
    }
  }

  render() {
    const healthBar = this.props.width * (this.props.health/this.state.maxHealth);
    const healthStyle = { width: `${healthBar}px` };
    const config = this.spriteConfig()

    return (
      <div id='boss'>
        <div className='health-bar' style={healthStyle}></div>
        <SpriteSheet filename={BossSprite} data={config} sprite={'boss'} />
      </div>
    )
  }
}

export default Boss;
