import React, { Component } from 'react';
import { connect } from 'react-redux';
import { SpriteSheet } from 'react-spritesheet'
import BossSprite from '../Boss.png'

class Boss extends Component {
  render() {
    const spriteConfig = {
      boss: {
        x: 0,
        y: 0,
        width: 63,
        height: 98,
      }
    }
    return (
      <div id='boss'>
        <SpriteSheet filename={BossSprite} data={spriteConfig} sprite={'boss'} />
      </div>
    )
  }
}

export default Boss;
