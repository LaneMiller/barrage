// Third-Party
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { SpriteSheet } from 'react-spritesheet';
// Components and Containers
import TitleScreen from '../components/TitleScreen';
import DifficultyScreen from '../components/DifficultyScreen';
import PassphraseForm from '../components/PassphraseForm';
import Level from './Level';
import ScoreCard from '../components/ScoreCard';
import HealthBar from '../HealthBar.png';
// Actions
import { changeGameStatus, createLevelSelect, setLevel, setPlayer, updatePlayerValue } from '../actions';
// Styling and Assets
import '../game.css';
import enemyTypes from '../dependencies/enemyTypes';
import Gun_Icons from '../Gun_Icons.png';
import gunSprites from '../adapters/gunSpriteConfig';
import fetchAdapter from '../adapters/fetchAdapter'

class Game extends Component {
  state = {
    difficulty: 'Easy',
    errorMsg: null,
  }

  componentDidMount() {
    if (window.screen.availHeight < 700) {
      alert("It seems that your screen resolution is too low.\nIn order to play, try zooming out in your browser or increasing your monitor's resolution.")
    }

    this.fetchLevels();
  }
  createOrLoadPlayer = (choice) => {
    if (choice === 'New Game') {
      this.createPlayer();
      this.showPassphrase()
    } else {
      this.loadGameState();
    }
  }
  createPlayer = () => {
    return fetchAdapter.createPlayer()
      .then(this.updatePlayer)
  }
  loadGameState = () => {
    this.props.dispatch( changeGameStatus('load game') )
  }
  loadPlayer = (choice, passphrase) => {
    if (choice === 'Enter') {
      const updateDifficultyCB = (player) => {this.updateDifficulty(player.difficulty)}

      fetchAdapter.loadPlayer(passphrase)
        .then(this.updatePlayer)
        .then(updateDifficultyCB)
        .then(this.setDifficulty)
        .catch(this.handleLoadFailure)
    } else {
      this.props.dispatch( changeGameStatus('title') )
    }
  }
  handleLoadFailure = (errorMsg) => {
    this.setState({ errorMsg })
  }
  updatePlayer = (playerData) => {
    this.props.dispatch( setPlayer(playerData) );
    this.setLevel();
    return playerData;
  }
  showPassphrase = () => {
    this.props.dispatch( changeGameStatus('passphrase screen') )
    window.addEventListener('keydown', this.chooseDifficulty);
  }
  chooseDifficulty = (e) => {
    this.props.dispatch( changeGameStatus('difficulty screen') );
    window.removeEventListener('keydown', this.chooseDifficulty);
  }
  updateDifficulty = (difficulty) => {
    if (difficulty) {
      this.setState({ difficulty });
    }
  }
  setDifficulty = () => {
    this.props.dispatch(
      updatePlayerValue({ difficulty: this.state.difficulty })
    )

    this.props.dispatch( changeGameStatus('directions') );
    window.addEventListener('keydown', this.startGame);
  }
  startGame = () => {
    this.props.dispatch( changeGameStatus('game') );
    window.removeEventListener('keydown', this.startGame);
  }

  fetchLevels = () => {
    fetchAdapter.fetchLevels().then(this.createLevelSelect)
  }
  createLevelSelect = (levels) => {
    const levelSelect = {}

    for (let l of levels) {
      levelSelect[l.id] = {
        levelId: l.id,
        bounds: {top: 0, bottom: 1000, left: 0, right: 1000},
        exits: [],
        pickups: [],
        waveSize: l.wave_size,
        wave: 0,
        killedEnemies: 0,
        enemies: {}
      }

      for (let e of l.enemies) {
        levelSelect[l.id].enemies[e.id] = {mobId: e.id, ...enemyTypes[e.enemy_type]}
      }
    }

    this.props.dispatch( createLevelSelect(levelSelect) )
  }
  setLevel = () => {
    const { levelSelect } = this.props;
    const currentLevel = this.props.player.level_id ? this.props.player.level_id : this.props.currentLevel;

    this.props.dispatch( setLevel(levelSelect[currentLevel]) )
  }

  renderGameState = () => {
    const { health, lives, score } = this.props.player;

    if (this.props.status === 'title') {
      return (
        <TitleScreen
          createOrLoadPlayer={this.createOrLoadPlayer}
        />
      )
    } else if (this.props.status === 'load game') {
      return (
        <React.Fragment>
          <h1 id='error-message'>{this.state.errorMsg}</h1>
          <PassphraseForm loadPlayer={this.loadPlayer} errorMsg={this.state.errorMsg}/>
        </React.Fragment>
      )
    } else if (this.props.status === 'difficulty screen') {
      return (
        <DifficultyScreen
          updateDifficulty={this.updateDifficulty}
          setDifficulty={this.setDifficulty}
          difficulty={this.state.difficulty}
        />
      )
    } else if (this.props.status === 'passphrase screen') {
      const passphrase = this.props.player.passphrase;
      return (
        <div id='passphrase-screen'>
          <h1>Here's your Password:</h1>
          <h2>{passphrase}</h2>
        </div>
      )
    } else if (this.props.status === 'directions') {
      return (
        <div id='directions'>
          <img src={require('../Directions.png')} />
        </div>
      )
    } else if (health <= 0 && lives === 0) {
      return (
        <ScoreCard />
      )
    } else if (this.props.status === 'win') {
      return (
        <React.Fragment>
          <h1 className='win-header'>You Win!</h1>
          <ScoreCard />
        </React.Fragment>
      )
    } else if (this.props.status === 'game') {
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

            <h1 id="level-display"
              style={{fontSize: `${hudHeight}px`}}>
              Level {this.props.currentLevel}
            </h1>
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
    status: state.status,
    currentLevel: state.currentLevel,
    levelSelect: state.levelSelect,
    level: state.level,
    player: state.player,
  }
}

export default connect(mapStateToProps)(Game);
