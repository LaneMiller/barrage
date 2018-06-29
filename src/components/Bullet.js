import React, { Component } from 'react';

class Bullet extends Component {
  render() {
    const bulletStyle = {
      marginLeft: `${this.props.x}`,
      marginTop: `${this.props.y}`,
    }
    return (
      <div className='bullet' style={bulletStyle}>.</div>
    )
  }
}

export default Bullet;
