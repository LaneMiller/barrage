import React, { Component } from 'react';
import Selection_Arrow from '../Selection_Arrow.png'

class DifficultyScreen extends Component {
  constructor(props) {
    super(props)
    this.choices = ['Easy', 'Medium', 'Hard']
  }
  componentDidMount() {
    window.addEventListener("keydown", this.selectDifficulty)
  }

  selectDifficulty = (e) => {
    const choices = this.choices
    const { difficulty } = this.props
    let i = choices.indexOf(difficulty);

    if (e.key === 'ArrowDown' && difficulty !== choices[choices.length-1]){
      this.props.updateDifficulty(choices[i+1])
    } else if (e.key === 'ArrowUp' && difficulty !== choices[0]){
      this.props.updateDifficulty(choices[i-1])
    } else if (e.key === 'Enter') {
      this.props.setDifficulty()
      window.removeEventListener("keydown", this.selectDifficulty)
    }
  }

  renderChoices = () => {
    const arrow = <img src={Selection_Arrow}/>

    return this.choices.map(choice => {
      if (choice === this.props.difficulty) {
        return <h4 key={choice} className='difficulty-choice'>{arrow}{choice}</h4>
      } else {
        return <h4 key={choice} className='difficulty-choice'>{choice}</h4>
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
