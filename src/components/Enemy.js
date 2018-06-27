import React, { Component } from 'react';

class Enemy extends Component {
  render() {
    return (
      <div style={{width:'20px', height:'20px', position:'absolute', marginTop:'20%', marginLeft:'20%', background:'red'}}></div>
    )
  }
}

export default Enemy;
