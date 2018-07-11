// Third-Party
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { SpriteSheet } from 'react-spritesheet';
// Components and Containers
import Level from './Level';
import ScoreCard from '../components/ScoreCard';
import HealthBar from '../HealthBar.png';
import DifficultyScreen from '../components/DifficultyScreen';
// Styling and Assets
import '../game.css';
import Gun_Icons from '../Gun_Icons.png';
import gunSprites from '../adapters/gunSpriteConfig';

class Game extends Component {
  state = {
    status: 'title',
    difficulty: 'Easy',
  }

  componentDidMount() {
    window.addEventListener('keydown', this.startGame);
  }
  startGame = (e) => {
    this.setState({ status: 'difficulty screen' });
    window.removeEventListener('keydown', this.startGame);
  }
  updateDifficulty = (difficulty) => {
    this.setState({ difficulty });
  }
  setDifficulty = () => {
    this.setState({ status: 'game' });
  }

  renderGameState = () => {
    const { health, lives, score } = this.props.player
    if (this.state.status === 'title') {
      return (
        <div className="title-screen" style={{position: 'absolute', top: '300px', left: '39%'}}>
          <h1 style={{fontSize: '160px'}}>Barrage</h1>
          <p style={{fontSize: '60px'}}>press any key to start</p>
        </div>
      )
    } else if (this.state.status === 'difficulty screen') {
      return (
        <DifficultyScreen updateDifficulty={this.updateDifficulty} setDifficulty={this.setDifficulty} difficulty={this.state.difficulty}/>
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
      const tileMap = this.props.currentLevel !== 4 ? <img src={require("../level.png")}/> : <img src={require("../bossLevel.png")}/>
      const healthBar = 87 * (health/100);
      const currentGun = this.renderCurrentGun();
      const ammoCount = this.props.player.gun.ammo ? <p id='ammo-count'>Ammo: {this.props.player.gun.ammo}</p> : null;

      return (
        <React.Fragment>
          {tileMap}

          <div className='game-items'>
            <h1 id="score">Score: {score}</h1>

            <h1 id="level-display"> Level {this.props.currentLevel}</h1>

            <div id="player-health-bar"
              style={{width: `${healthBar}px`}}>
              <img id="player-health" src={HealthBar}/>
            </div>

            <div id='lives-counter'>
              x{this.props.player.lives}
            </div>

            <div id='current-gun'>
              {currentGun}
              <p id='current-gun-type'>{this.props.player.gun.type}</p>
              {ammoCount}
            </div>

            <Level
              difficulty={this.state.difficulty}
              levelId={this.props.level.levelId}
              enemies={this.props.level.enemies}
            />
          </div>
        </React.Fragment>
      )
    }
  }

  renderCurrentGun = () => {
    return <SpriteSheet  filename={Gun_Icons} data={gunSprites} sprite={this.props.player.gun.type} />
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
