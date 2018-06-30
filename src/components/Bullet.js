import React, { Component } from 'react';
import { connect } from 'react-redux';
import { damageEnemy } from '../actions';

class Bullet extends Component {
  componentDidMount() {
    this.interval = setInterval(this.checkCollision, 100);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  checkCollision = () => {
    const { x, y, angle } = this.props;
    for (let key in this.props.enemies) {
      const enemy = this.props.enemies[key];
      let xBounds, yBounds;

      if (angle === 0 || angle === 180) {
        xBounds = ((x+1) >= (enemy.x-6) && (x+1) <= ((enemy.x-6) + enemy.width));
        yBounds = (y >= enemy.y && y <= (enemy.y + enemy.height));
      } else {
        xBounds = (x >= (enemy.x-6) && x <= ((enemy.x-6) + enemy.width));
        yBounds = ((y+10) >= enemy.y && (y+10) <= (enemy.y + enemy.height));
      }

      if (enemy.rotation === 90 || enemy.rotation === 270) {
        if (angle === 0 || angle === 180) {
          xBounds = ((x+1) >= (enemy.x-12) && (x+1) <= (enemy.x-12) + enemy.height);
          yBounds = (y >= (enemy.y+5) && y <= (enemy.y+5) + enemy.width);
        } else {
          xBounds = (x >= (enemy.x-12) && x <= (enemy.x-12) + enemy.height);
          yBounds = ((y+10) >= (enemy.y+5) && (y+10) <= (enemy.y+5) + enemy.width);
        }
      }

      if (xBounds && yBounds) {
        this.props.dispatch( damageEnemy({[enemy.mobId]: {...enemy, health: (enemy.health - this.props.damage)}}) );
      }
    }
  }

  bulletOffsets = () => {
    let { x, y } = this.props;
    if (this.props.angle === 0) {
      x -= .25;
      y += 7;
    }
    if (this.props.angle === 90) {
      x -= 5;
      y += 2;
    }
    if (this.props.angle === 180) {
      x -= .25;
      y -= 1;
    }
    if (this.props.angle === 270) {
      x += 3;
      y += 2;
    }

    return [x,y];
  }

  render() {
    const xy = this.bulletOffsets();
    const bulletStyle = {
      marginLeft: `${xy[0]}px`,
      marginTop: `${xy[1]}px`,
      transform: `rotate(${this.props.angle}deg)`,
    };
    return (
      <div>
        <div className='bullet' style={bulletStyle}>.</div>
        <div style={{backgroundColor: 'red', position: 'absolute', marginLeft: `${this.x}px`, marginTop: `${this.y}px`, height: `${this.height}px`, width: `${this.width}px`}}></div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    enemies: state.level.enemies,
  };
}

export default connect(mapStateToProps)(Bullet);
