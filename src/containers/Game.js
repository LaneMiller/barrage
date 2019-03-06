// Third-Party
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { SpriteSheet } from 'react-spritesheet';
// Components and Containers
import ErrorScreen from '../components/ErrorScreen';
import TitleScreen from '../components/TitleScreen';
import About from '../components/About';
import DifficultyScreen from '../components/DifficultyScreen';
import PassphraseForm from '../components/PassphraseForm';
import Level from './Level';
import ScoreCard from '../components/ScoreCard';
// Actions
import * as actions from '../actions';
// Styling and Assets
import '../game.css';
import enemyTypes from '../dependencies/enemyTypes';
import HealthBar from '../dependencies/imgs/HealthBar.png';
import Gun_Icons from '../dependencies/imgs/Gun_Icons.png';
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

  handleServerError = () => {
    this.props.changeGameStatus('error');
  }

  backToMainMenu = () => {
    this.props.changeGameStatus('title');
  }

  // Player persistance functions
  createOrLoadPlayer = (choice) => {
    if (choice === 'New Game') {
      fetchAdapter.createPlayer()
        .then(this.updatePlayer)
        .then(this.showPassphrase)
        .catch(this.handleServerError)
    } else {
      this.loadGameState();
    }
  }

  loadGameState = () => {
    this.props.changeGameStatus('load game');
  }

  loadPlayer = (choice, passphrase) => {
    if (choice === 'Enter') {
      const updateDifficultyCB = (player) => {this.updateDifficulty(player.difficulty)}

      fetchAdapter.loadPlayer(passphrase)
        .then(this.updatePlayer)
        .then(updateDifficultyCB)
        .then(this.setDifficulty)
        .catch((errorMsg) => {
          if (typeof errorMsg === 'string') {
            this.handleBadPassword(errorMsg)
          } else {
            this.handleServerError()
          }
        })
    } else {
      this.setState({ errorMsg: null })
      this.props.changeGameStatus('title');
    }
  }

  handleBadPassword = (errorMsg) => {
    this.setState({ errorMsg })
  }

  updatePlayer = (playerData) => {
    this.props.setPlayer(playerData);
    this.setLevel();
    return playerData;
  }

  // Menu navigation and choice handling funcitons
  showPassphrase = () => {
    this.props.changeGameStatus('passphrase screen');
    window.addEventListener('keydown', this.chooseDifficulty);
  }

  chooseDifficulty = (e) => {
    this.props.changeGameStatus('difficulty screen');
    window.removeEventListener('keydown', this.chooseDifficulty);
  }

  updateDifficulty = (difficulty) => {
    if (difficulty) {
      this.setState({ difficulty });
    }
  }

  setDifficulty = () => {
    this.props.updatePlayerValue({ difficulty: this.state.difficulty });
    this.props.changeGameStatus('directions');

    window.addEventListener('keydown', this.startGame);
  }

  startGame = () => {
    this.props.changeGameStatus('game');
    window.removeEventListener('keydown', this.startGame);
  }

  // Level data functions
  fetchLevels = () => {
    fetchAdapter.fetchLevels().then(this.createLevelSelect)
  }
  createLevelSelect = (levels) => {
    const levelSelect = {}

    for (let l of levels) {
      levelSelect[l.level_id] = {
        levelId: l.level_id,
        bounds: {top: 0, bottom: 1000, left: 0, right: 1000},
        exits: [],
        pickups: [],
        waveSize: l.wave_size,
        wave: 0,
        killedEnemies: 0,
        enemies: {}
      }

      for (let e of l.enemies) {
        levelSelect[l.level_id].enemies[e.id] = {mobId: e.id, ...enemyTypes[e.enemy_type]}
      }
    }

    this.props.createLevelSelect(levelSelect);
  }

  setLevel = () => {
    const { levelSelect } = this.props;
    const currentLevel = this.props.player.level_id ? this.props.player.level_id : this.props.currentLevel;

    this.props.setLevel(levelSelect[currentLevel]);
  }

  checkDynoSleep = () => {
    if (!this.state.sleepMsg) {
      setTimeout(() => {
        window.removeEventListener('keydown', this.chooseDifficulty);
        this.setState({ sleepMsg: true })
      }, 4000)
    }
  }

  showSleepMsg = () => {
    return (
      <div className='dyno-sleep-msg'>
        <span>Hmmm... this is taking a while.</span><br></br>
        <span>The Heroku Dyno is probably sleeping if no one has played in a bit. </span>
        <span>Please refresh the page, Heroku should have loaded the server by now. </span><br></br>
        <span>To learn more, visit </span>
        <a href="https://devcenter.heroku.com/articles/free-dyno-hours#dyno-sleeping"
          target="_blank" rel="noopener noreferrer"
          style={{ color: 'LightSkyBlue' }}>
          the Heroku page on Dyno sleeping.
        </a>
      </div>
    )
  }

  // Main render functions
  renderGameState = () => {
    const { health, lives, score } = this.props.player;

    // TODO: Consider changing this to a switch statement for legebility;
    // Would need to refactor 'game over' condition (line 198) to be reflected in status flag.
    if (this.props.status === 'error') {
      return (
        <ErrorScreen />
      )
    } else if (this.props.status === 'title') {
      return (
        <TitleScreen
          createOrLoadPlayer={this.createOrLoadPlayer}
        />
      )
    } else if (this.props.status === 'about') {
      return (
        <About backToMainMenu={this.backToMainMenu}/>
      )
    } else if (this.props.status === 'load game') {
      return (
        <React.Fragment>
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
      const passphrase = this.props.player.passphrase || 'generating...';
      passphrase === 'generating...' ? this.checkDynoSleep() : null;

      return (
        <div id='passphrase-screen'>
          <h1>Here's your Password:</h1>
          <h2>{passphrase}</h2>
          {this.state.sleepMsg ? this.showSleepMsg() : null}
        </div>
      )
    } else if (this.props.status === 'directions') {
      return (
        <div id='directions'>
          <img alt='game directions' src={require('../dependencies/imgs/Directions.png')} />
        </div>
      )
    // TODO: Update this condition to this.props.status === 'game over',
    // set props.status from Player when dead. (See Player.js line 310)
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
      const tileMap = <img alt='game tilemap' src={require(`../dependencies/imgs/level${currentLevel}.png`)}/>

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
              <img  alt='player health bar' id="player-health"
                src={HealthBar} width={`${healthWidth}px`}/>
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

export default connect(mapStateToProps, actions)(Game);
