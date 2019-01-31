import React, { Component } from 'react';
import { connect } from 'react-redux';
import { AnimatedSpriteSheet } from 'react-spritesheet';

import Player from '../components/Player';
import Enemy from '../components/Enemy';
import Pickups from './Pickups';
import { setLevel, setPlayArea, setEntrances } from '../actions'

import difficultyAdapter from '../adapters/difficulty';
import { updateEnemyPos, updatePlayerLevelStatus, incrementWaveCount, removeEnemy } from '../actions';
import goArrow from '../goArrow.png';

class Level extends Component {
  state = {
    doors: null,
  }

  componentDidMount() {
    const delay = difficultyAdapter[this.props.difficulty];
    const entrances = this.updateBounds();
    this.setSpawnPoints(entrances);

    this.spawnRate = setInterval(this.incrementWave, delay);
    window.addEventListener("resize", this.updateBounds);
  }
  componentWillUnmount() {
    clearInterval(this.spawnRate);
    window.removeEventListener("resize", this.updateBounds);
  }
  componentDidUpdate(prevProps) {
    if (this.props.levelId !== prevProps.levelId) {
      this.setState({ doors: null })
      this.setSpawnPoints(this.props.entrances);
    }
  }
  updateBounds = () => {
    const playArea = this.setPlayArea();
    const bounds = this.setBounds(playArea);
    const entryPoints = this.setEntrances(bounds);
    //return entrances for enemy spawn point generation
    return entryPoints;
  }
  setPlayArea = () => {
    const playArea = document.querySelector('.level');
    this.props.dispatch( setPlayArea({
      height: playArea.offsetHeight,
      width: playArea.offsetWidth
    }) );
    return playArea;
  }
  setBounds = (playArea) => {
    const scale = playArea.offsetHeight/402; // Current Width/1:1 width
    const bottom = playArea.offsetHeight - (24 * scale); // accomodates for player height at scale
    const right = playArea.offsetWidth - (24 * scale);
    const bounds = {top: 0, bottom, left: 0, right};

    this.props.dispatch( setLevel({...this.props.level, bounds}) );
    return bounds;
  }
  setEntrances = (bounds) => {
    const entryPoints = {
      top: [bounds.right/2, -1],
      left: [-1, bounds.bottom/2],
      bottom: [bounds.right/2, bounds.bottom+1],
      right: [bounds.right+1, bounds.bottom/2],
    }

    this.props.dispatch( setEntrances(entryPoints) );
    return entryPoints;
  }
  incrementWave = () => {
    if (this.props.wave < 3) {
      this.props.dispatch( incrementWaveCount() );
      this.openDoors();

      setTimeout(this.closeDoors, 1000);
    }
  }
  openDoors = (exitDoor) => {
    const doors = exitDoor ? exitDoor : <img src={require(`../openLevel${this.props.levelId}.png`)}/>

    this.setState({ doors });
  }
  closeDoors = () => {
    this.setState({ doors: null })
  }

  randomSpawnPoints = (entrances) => {
    // top x3, bottom x3, left x3, right x3 (to prevent stacking)
    let spawnsXY = [
      ...new Array(3).fill(entrances.top),
      ...new Array(3).fill(entrances.bottom),
      ...new Array(3).fill(entrances.left),
      ...new Array(3).fill(entrances.right),
    ]

    return spawnsXY[Math.floor(Math.random() * spawnsXY.length)];
  }

  setSpawnPoints = (entrances) => {
    for (let key in this.props.enemies) {
      // set inital location for enemies
      const spawnXY = this.randomSpawnPoints(entrances);

      this.props.dispatch( updateEnemyPos({
        [key]: {...this.props.enemies[key], x: spawnXY[0], y: spawnXY[1], rotation: 0}
      }) );
    }
  }

  removeEnemy = (id) => {
    const remaining = {...this.props.enemies};
    delete remaining[id];
    this.props.dispatch( removeEnemy(remaining) );
    // Check if the level is clear and open exits
    if (Object.keys(this.props.enemies).length === 0) {
      this.props.dispatch( updatePlayerLevelStatus('clear') )
      this.openDoors(<img src={require(`../exitRight${this.props.levelId}.png`)}/>)
    }
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

  render() {
    const Enemies = this.renderEnemies();
    const openDoors = this.state.doors !== null ? this.state.doors : null;
    const goArrow = this.renderGoArrow();
    const levelBounds = this.props.levelBounds;

    return (
      <React.Fragment>
        {openDoors}
        <div className='level'>
          <div className="game-entities">
            <Pickups />
            <Player />
            {Enemies}
          </div>

          <div id='go-arrow'>
            {goArrow}
          </div>
        </div>
      </React.Fragment>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    level: state.level,
    wave: state.level.wave,
    waveSize: state.level.waveSize,
    playArea: state.playArea,
    levelBounds: state.level.bounds,
    entrances: state.entrances,
    dead: state.level.killedEnemies,
  }
}
export default connect(mapStateToProps)(Level);
