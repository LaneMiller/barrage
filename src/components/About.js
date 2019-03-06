import React, { Component } from 'react';
import Selection_Arrow from '../dependencies/imgs/Selection_Arrow.png'

class About extends Component {
  componentDidMount() {
    window.addEventListener('keydown', this.handleKeydown)
  }
  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKeydown)
  }

  handleKeydown = (e) => {
    e.key === 'Enter' ? this.props.backToMainMenu() : null;
  }

  render() {
    const arrow = <img alt='choice selection' src={Selection_Arrow}/>
    return (
      <div className='about-page'>
        <h1>BARRAGE</h1>
        <h2>by Lane Miller</h2>

        <div className='about-page-links'>
          <a href='https://github.com/LaneMiller' target="_blank" rel="noopener noreferrer">
            <img alt='github icon link' src={require('../dependencies/imgs/github-icon.png')} />
          </a>
          <a href='https://www.linkedin.com/in/clanemiller/' target="_blank" rel="noopener noreferrer">
            <img alt='linkedin icon link' src={require('../dependencies/imgs/linkedin-icon.png')} />
          </a>
        </div>

        <p>BARRAGE is an 80's style top-down arcade game built in React with Redux
          with a Rails API backend that it loads from and saves data to.</p>

        <p>All of the gameplay was developed in 3 weeks during the Summer of 2018.</p>

        <p>Since then, all of the work on this program was focused on more dynamic styling
          to better accomodate screens of different resolutions, as well as some additional
          error handling and refactoring for deployment.</p>

        <span className='choice'>{arrow}Main Menu</span>
      </div>
    )
  }
}

export default About;
