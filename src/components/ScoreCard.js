import React, { Component } from 'react';
import { connect } from 'react-redux';

class ScoreCard extends Component {
  render() {
    return (
      <div id="score-card">
        <h1>Total Score</h1>
        <h3>{this.props.player.score}</h3>
        <h4>Prizes: [pts form Prizes]</h4>
        <h4>Cash: [pts from $]</h4>
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
