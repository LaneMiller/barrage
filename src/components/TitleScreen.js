import React, { Component } from 'react';
import Selection_Arrow from '../Selection_Arrow.png'

class TitleScreen extends Component {
  constructor(props) {
    super(props)

    this.choices = ['New Game', 'Load Game'];
    this.state = {
      selected: 'New Game',
    }
  }
  componentDidMount() {
    window.addEventListener("keydown", this.selectGameOption)
  }

  selectGameOption = (e) => {
    const choices = this.choices,
          selected = this.state.selected;
    let i = choices.indexOf(selected);

    if (e.key === 'ArrowDown' && selected !== choices[choices.length-1]){
      this.setState({ selected: choices[i+1] });
    } else if (e.key === 'ArrowUp' && selected !== choices[0]){
      this.setState({ selected: choices[i-1] });
    } else if (e.key === 'Enter') {
      this.props.createOrLoadPlayer(this.state.selected)
      window.removeEventListener("keydown", this.selectGameOption)
    }
  }

  renderChoices = () => {
    const arrow = <img src={Selection_Arrow}/>

    return this.choices.map(choice => {
      if (choice === this.state.selected) {
        return <h4 key={choice} className='title-choice'>{arrow}{choice}</h4>
      } else {
        return <h4 key={choice} className='title-choice'>{choice}</h4>
      }
    })
  }

  render() {
    const choices = this.renderChoices()

    return (
      <div id="title-screen">
        <h1 id='title' style={{fontSize: '200px'}}>BARRAGE</h1>
        { choices }
      </div>
    )
  }
}

export default TitleScreen;
