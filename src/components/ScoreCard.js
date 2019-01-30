import React, { Component } from 'react';
import { connect } from 'react-redux';

class ScoreCard extends Component {
  render() {
    return (
      <div id="score-card">
        <h1 style={{marginTop: '0'}}>Total Score</h1>
        <h3>{this.props.player.score}</h3>
        <h4>Kills: {this.props.player.kills}</h4>
        <h4>Bonus Points: {this.props.player.bonus}</h4>
        <p>CMD + R to play again</p>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    player: state.player
  }
}

export default connect(mapStateToProps)(ScoreCard);
