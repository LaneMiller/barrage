import React, { Component } from 'react';
import { connect } from 'react-redux';

class ScoreCard extends Component {
  render() {
    return (
      <div id="score-card">
        <h1>Total Score</h1>
        <h3>{this.props.player.score}</h3>
        <h4>Kills: {this.props.player.kills}</h4>
        {/* <h4>Prizes: {this.props.player.prizes}</h4>
        <h4>Cash: {this.props.player.cash}</h4> */}
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
