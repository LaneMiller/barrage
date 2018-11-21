import React, { Component } from 'react';
import { connect } from 'react-redux';
import { AnimatedSpriteSheet } from 'react-spritesheet';

import Player from '../components/Player';
import Enemy from '../components/Enemy';
import Pickups from './Pickups';
import { setLevel, setPlayArea } from '../actions'

import difficultyAdapter from '../adapters/difficulty';
import { updateEnemyPos, updatePlayerLevelStatus, incrementWaveCount, removeEnemy } from '../actions';
import goArrow from '../goArrow.png';

class Level extends Component {
  state = {
    doors: null,
  }

  componentDidMount() {
    // const delay = difficultyAdapter[this.props.difficulty];
    // this.spawnRate = setInterval(this.incrementWave, delay);
    //
    // this.setSpawnPoints();
    // this.incrementWave();
    this.setBounds();
    window.addEventListener("resize", this.setBounds);
  }
  componentWillUnmount() {
    clearInterval(this.spawnRate);
    window.removeEventListener("resize", this.setBounds);
  }
  componentDidUpdate(prevProps) {
    if (this.props.levelId !== prevProps.levelId) {
      this.setSpawnPoints();
    }
  }
  setBounds = () => {
    const playArea = document.querySelector('.level');
    const scale = playArea.offsetHeight/402; // Current Width/1:1 width
    const bottom = playArea.offsetHeight - (24 * scale); // accomodates for player height at scale
    const right = playArea.offsetWidth - (24 * scale);
    const bounds = {top: 0, bottom, left: 0, right};

    this.props.dispatch( setLevel({...this.props.level, bounds}) );
    this.props.dispatch( setPlayArea({
      height: playArea.offsetHeight,
      width: playArea.offsetWidth
    }) );
  }
  incrementWave = () => {
    if (this.props.wave < 3) {
      this.props.dispatch( incrementWaveCount() );
      this.setState({
        doors: <img src={require("../openLevelMinimal.png")}/>
      });

      setTimeout(this.closeDoors, 1000);
    }
  }
  closeDoors = () => {
    this.setState({ doors: null })
  }

  randomSpawnPoints = () => {
    // top x3, right x3, bottom x3, left x3 (to prevent stacking)
    let spawnsXY = [[950, 20], [952, 20], [954, 20], [1150, 110], [1150, 112], [1150, 114], [950, 197], [952, 197], [954, 197], [753, 110], [753, 112], [753, 114]]
    return spawnsXY[Math.floor(Math.random() * spawnsXY.length)];
  }

  setSpawnPoints = () => {
    for (let key in this.props.enemies) {
      // set inital location for enemies
      const spawnXY = this.randomSpawnPoints();

      this.props.dispatch( updateEnemyPos({
        [key]: {...this.props.enemies[key], x: spawnXY[0], y: spawnXY[1], rotation: 0}
      }) );
    }
  }

  removeEnemy = (id) => {
    const remaining = {...this.props.enemies};
    delete remaining[id];
    this.props.dispatch( removeEnemy(remaining) );
  }

  renderGoArrow = () => {
    if (Object.keys(this.props.enemies).length === 0) {
      return (
        <AnimatedSpriteSheet
            filename={goArrow}
            initialFrame={0}
            frame={{ width: 87, height: 35 }}
            bounds={{ x: 0, y: 0, width: 87, height: 35 }}
            isPlaying
            loop
            speed={300}
          />
      )
    } else {
      return null;
    }
  }

  renderEnemies = () => {
    const { waveSize, dead } = this.props;
    // const { top, bottom, left, right } = this.props.levelBounds;
    const { top, bottom, left, right } = this.levelBounds || {top: null, bottom: null, left: null, right: null};
    const map = [];

    let i = 0;
    for (let key in this.props.enemies) {
      if (this.props.wave === 1 && i < waveSize - dead) {
        map.push(<Enemy key={key} removeEnemy={this.removeEnemy} {...this.props.enemies[key]} />)
      } else if (this.props.wave === 2 && i < (waveSize*2 - dead)) {
        map.push(<Enemy key={key} removeEnemy={this.removeEnemy} {...this.props.enemies[key]} />)
      } else if (this.props.wave > 2) {
        map.push(<Enemy key={key} removeEnemy={this.removeEnemy} {...this.props.enemies[key]} />)
      };
      i++
    };

    return map;
  }

  renderExits = () => {
    if (Object.keys(this.props.enemies).length === 0) {
      this.props.dispatch( updatePlayerLevelStatus('clear') )
      return <img src={require("../exitRight.png")}/>
    } else {
      return null;
    }
  }

  render() {
    const Enemies = this.renderEnemies();
    const openDoors = this.state.doors !== null ? this.state.doors : null;
    const levelExits = this.renderExits();
    const goArrow = this.renderGoArrow();

    return (
      <div className='level'>
        <div className="game-entities">
          {openDoors}
          {levelExits}
          <Pickups />
          <Player />
          {Enemies}
        </div>

        <div id='go-arrow'>
          {goArrow}
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    level: state.level,
    wave: state.level.wave,
    waveSize: state.level.waveSize,
    levelBounds: state.level.bounds,
    dead: state.level.killedEnemies,
  }
}
export default connect(mapStateToProps)(Level);
