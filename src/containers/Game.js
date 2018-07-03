import React, { Component } from 'react';
import Level from './Level'
import ScoreCard from '../components/ScoreCard'
import DifficultyScreen from '../components/DifficultyScreen'
import '../game.css'
import { connect } from 'react-redux';

class Game extends Component {
  state = {
    status: 'title',
    difficulty: 'Easy',
    currentLevel: 1,
  }

  componentDidMount() {
    window.addEventListener('keydown', this.startGame)
  }
  startGame = (e) => {
    this.setState({ status: 'difficulty screen' })
    window.removeEventListener('keydown', this.startGame)
  }
  updateDifficulty = (difficulty) => {
    this.setState({ difficulty })
  }
  setDifficulty = () => {
    this.setState({ status: 'game' })
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
      // <div className="game-over" style={{position: 'absolute', top: '550px', left: '46%'}}>
      //   <h1>You Dead.</h1>
      //   <h3>Game Over</h3>
      // </div>
      return (
        <ScoreCard />
      )
    } else {
      return (
        <React.Fragment>
          <h1 id="score">Score: {score}</h1>
          <Level enemies={this.props.level.enemies}/>
        </React.Fragment>
      )
    }
  }

  render() {
    const gameState = this.renderGameState()
    return (
      <div className='game'>
        {/*
          <img src={require("../Background.png")}/>
          <img src={require("../closedLevelBlue.png")}/>
          */}
          <img src={require("../level.png")}/>
        {gameState}
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    level: state.level,
    player: state.player,
  }
}

export default connect(mapStateToProps)(Game);
