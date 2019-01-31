import React, { Component } from 'react';
import Selection_Arrow from '../Selection_Arrow.png'

class PassphraseForm extends Component {
  constructor(props) {
    super(props)

    this.choices = ['Enter', 'Back'];
    this.state = {
      input: '',
      selected: 'Enter',
    }
  }
  componentDidMount() {
    window.addEventListener("keydown", this.selectLoadOption)
  }
  componentWillUnmount() {
    window.removeEventListener("keydown", this.selectLoadOption);
  }

  updateInput = (e) => {
    let input = e.target.value
    input = input.substring(0, 6).toLowerCase()

    this.setState({ input })
  }

  selectLoadOption = (e) => {
    const choices = this.choices,
          selected = this.state.selected;
    let i = choices.indexOf(selected);

    if (e.key === 'ArrowDown' && selected !== choices[choices.length-1]){
      this.setState({ selected: choices[i+1] });
    } else if (e.key === 'ArrowUp' && selected !== choices[0]){
      this.setState({ selected: choices[i-1] });
    } else if (e.key === 'Enter') {
      this.props.loadPlayer(selected, this.state.input);
    }
  }

  renderChoices = () => {
    const arrow = <img src={Selection_Arrow}/>

    return this.choices.map(choice => {
      if (choice === this.state.selected) {
        return <h4 key={choice} className='load-choice'>{arrow}{choice}</h4>
      } else {
        return <h4 key={choice} className='load-choice'>{choice}</h4>
      }
    })
  }

  render() {
    const choices = this.renderChoices()

    return (
      <div id='passphrase-form'>
        <h3>Enter Password:</h3>
        <input id='passphrase-input' type='text'
          autoFocus spellCheck='false'
          value={this.state.input} onChange={this.updateInput}/>
        { choices }
      </div>
    )
  }
}

export default PassphraseForm;
