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
    const { /*x, y,*/ angle } = this.props;
    const [x, y] = this.bulletOffsets();

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
        this.props.removeBullet(this.props.id);
        const newHealth = enemy.health - this.props.gun.damage;
        this.props.dispatch(
          damageEnemy( {[key]: {...enemy, health: newHealth}} )
        );
      };
    };
  }

  bulletOffsets = () => {
    let { x, y, angle } = this.props;
    //downward
    if (angle >= -10 && angle <= 10) {
      x += 6;
      y += 22;
    }
    //SW-ward
    if (angle >= 35 && angle <= 55) {
      x -= 7;
      y += 17;
    }
    //leftward
    if (angle >= 80 && angle <= 100) {
      x -= 13;
      y += 3;
    }
    //NW-ward
    if (angle >= 125 && angle <= 145) {
      x -= 9;
      y -= 12;
    }
    //upward
    if (angle >= 170 && angle <= 190) {
      x += 6;
      y -= 17;
    }
    //NE-ward
    if (angle >= 215 && angle <= 235) {
      x += 21;
      y -= 12;
    }
    //rightward
    if (angle >= 260 && angle <= 280) {
      x += 26;
      y += 3;
    }
    //SE-ward
    if (angle >= 305 && angle <= 325) {
      x += 22;
      y += 19;
    }

    return [x,y];
  }

  render() {
    const xy = this.bulletOffsets();
    // let { x, y, angle } = this.props; //original positions
    const playAreaWidth = this.props.playArea.width;
    const scale = playAreaWidth/402;

    const bulletStyle = {
      left: `${xy[0]}px`,
      top: `${xy[1]}px`,
      transform: `rotate(${this.props.angle}deg) scale(${scale})`,
    };

    return (
      <div>
        <div className='bullet' style={bulletStyle}>.</div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    gun: state.player.gun,
    enemies: state.level.enemies,
    playArea: state.playArea,
  };
}

export default connect(mapStateToProps)(Bullet);
