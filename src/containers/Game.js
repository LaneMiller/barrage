// Third-Party
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { SpriteSheet } from 'react-spritesheet';
// Components and Containers
import Level from './Level';
import ScoreCard from '../components/ScoreCard';
import HealthBar from '../HealthBar.png';
import DifficultyScreen from '../components/DifficultyScreen';
// Actions
import { setLevel } from '../actions'
// Styling and Assets
import '../game.css';
import enemyTypes from '../dependencies/enemyTypes'
import Gun_Icons from '../Gun_Icons.png';
import gunSprites from '../adapters/gunSpriteConfig';

class Game extends Component {
  state = {
    status: 'title',
    difficulty: 'Easy',
  }

  componentDidMount() {
    window.addEventListener('keydown', this.chooseDifficulty);
    this.fetchLevel()
  }
  chooseDifficulty = (e) => {
    this.setState({ status: 'difficulty screen' });
    window.removeEventListener('keydown', this.chooseDifficulty);
  }
  updateDifficulty = (difficulty) => {
    this.setState({ difficulty });
  }
  setDifficulty = () => {
    window.addEventListener('keydown', this.startGame);
    this.setState({ status: 'directions' });
  }
  startGame = () => {
    this.setState({ status: 'game' });
    window.removeEventListener('keydown', this.startGame);
  }
  componentDidUpdate(prevProps) {
    if (this.props.currentLevel !== prevProps.currentLevel) {
      this.fetchLevel()
      //this.autosave()
    }
  }

  fetchLevel = () => {
      fetch(`http://localhost:3000/api/v1/levels/${this.props.currentLevel}`)
        .then(res => res.json()).then(this.setLevel);
  }

  autosave = () => {
    // fetch(`http://localhost:3000/api/v1/users`, )
  }

  setLevel = (data) => {
    const level = {
      levelId: data.id,
      bounds: {top: 0, bottom: 900, left: 0, right: 900},
      exits: [],
      pickups: [],
      waveSize: data.wave_size,
      wave: 0,
      killedEnemies: 0,
      enemies: {}
    }

    for (let e of data.enemies) {
      const spawnXY = this.randomSpawnPoints();

      level.enemies[e.id] = {mobId: e.id, ...enemyTypes[e.enemy_type], x: spawnXY[0], y: spawnXY[1]}
    }

    this.props.dispatch( setLevel(level) )
  }

  randomSpawnPoints = () => {
    // top x3, right x3, bottom x3, left x3 (to prevent stacking)
    let spawnsXY = [[950, 20], [952, 20], [954, 20], [1150, 110], [1150, 112], [1150, 114], [950, 197], [952, 197], [954, 197], [753, 110], [753, 112], [753, 114]]
    return spawnsXY[Math.floor(Math.random() * spawnsXY.length)];
  }

  renderGameState = () => {
    const { health, lives, score } = this.props.player
    if (this.state.status === 'title') {
      return (
        <div className="title-screen" style={{position: 'absolute', top: '300px', left: '39%'}}>
          <h1 id='title' style={{fontSize: '200px'}}>BARRAGE</h1>
          <p style={{fontSize: '60px'}}>press any key to start</p>
        </div>
      )
    } else if (this.state.status === 'difficulty screen') {
      return (
        <DifficultyScreen updateDifficulty={this.updateDifficulty} setDifficulty={this.setDifficulty} difficulty={this.state.difficulty}/>
      )
    } else if (this.state.status === 'directions') {
      return (
        <div id='directions'>
          <img src={require('../Directions.png')} />
          <h1 id='wasd'>Move</h1>
          <h1 id='arrows'>Aim</h1>
          <h1 id='space'>Fire!</h1>
        </div>
      )
    } else if (health <= 0 && lives === 0) {
      return (
        <ScoreCard />
      )
    } else if (Object.keys(this.props.level.enemies).length === 0 && this.props.currentLevel === 3) {
      return (
        <div id='win-screen'>
          <h1>You Win!</h1>
          <ScoreCard />
        </div>
      )
    } else {
      const hudHeight = document.querySelector(".game").clientHeight * 0.1
      const { currentLevel } = this.props;
      const currentGun = this.renderCurrentGun();
      const ammoCount = this.props.player.gun.ammo ? ` x${this.props.player.gun.ammo}` : null;
      const healthWidth = document.querySelector(".game").clientWidth * 0.195
      const healthBar = (healthWidth * (health/100)) * 0.875 - 3;
      const tileMap = currentLevel !== 4 ? <img src={require(`../level${currentLevel}.png`)}/> : <img src={require("../bossLevel.png")}/>

      return (
        <React.Fragment>
          <div className='hud-items'>
            <h1 id="score" style={{fontSize: `${hudHeight}px`}}>{score} pts</h1>

            <h1 id="level-display" style={{fontSize: `${hudHeight}px`}}> Level {this.props.currentLevel}</h1>
            <div className="health">
              <div id="player-health-bar"
                style={{height: `${hudHeight/8}px`, width: `${healthBar}px`}}>
              </div>
              <img id="player-health" src={HealthBar} width={`${healthWidth}px`}/>
            </div>

            <div id='lives-counter' style={{fontSize: `${hudHeight}px`}}>
              x{this.props.player.lives}
            </div>

            <div id='current-gun'>
              {currentGun}
              <p id='current-gun-type' style={{fontSize: `${hudHeight/3}px`}}>{this.props.player.gun.type}{ammoCount}</p>
            </div>

          </div>

          {tileMap}
          <Level
            difficulty={this.state.difficulty}
            levelId={this.props.level.levelId}
            enemies={this.props.level.enemies}
            />
        </React.Fragment>
      )
    }
  }

  renderCurrentGun = () => {
    return <SpriteSheet filename={Gun_Icons}
                        data={gunSprites}
                        sprite={this.props.player.gun.type}
                        />
  }

  render() {
    const gameState = this.renderGameState()
    return (
      <div className='game'>
        {gameState}
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    currentLevel: state.currentLevel,
    level: state.level,
    player: state.player,
  }
}

export default connect(mapStateToProps)(Game);
