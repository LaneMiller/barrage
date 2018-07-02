import React, { Component } from 'react';
import Selection_Arrow from '../Selection_Arrow.png'

class DifficultyScreen extends Component {
  state = {
    selected: 'Easy',
    choices: ['Easy', 'Medium', 'Hard'],
  }

  componentDidMount() {
    window.addEventListener("keydown", this.selectDifficulty)
  }

  selectDifficulty = (e) => {
    const { choices, selected } = this.state;
    let i = choices.indexOf(selected);

    if (e.key === 'ArrowDown' && selected !== choices[choices.length-1]){
      this.setState({ selected: choices[i+1] })
    } else if( e.key === 'ArrowUp' && selected !== choices[0]){
      this.setState({ selected: choices[i-1] })
    }
  }

  renderChoices = () => {
    const arrow = <img src={Selection_Arrow}/>

    return this.state.choices.map(choice => {
      if (choice === this.state.selected) {
        return <h4 className='difficulty-choice'>{arrow}{choice}</h4>
      } else {
        return <h4 className='difficulty-choice'>{choice}</h4>
      }
    })
  }

  render() {
    const choices = this.renderChoices()

    return (
      <div id="difficulty-screen">
        <h1 style={{fontSize: '120px'}}>Choose difficulty:</h1>
        { choices }
      </div>
    )
  }
}

export default DifficultyScreen;
