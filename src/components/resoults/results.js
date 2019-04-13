import React, { Component } from 'react';
import {localStorageService} from '../../services';
import './results.css';

const TOP_RANKING = 5

export class Results extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ranking: '',
      currentUserScore: '',
      topScorers: []
    }
  }

  componentWillMount() {
    this.setState({ranking: localStorageService.get('ranking'), currentUserScore: localStorageService.get('currentUserScore')}, () => this.updateData());
  }

  updateData() {
    this.sortScores()
    this.limitToShow()
  }

  goToHome() {
    localStorage.currentUser && localStorageService.remove('currentUser')
    localStorage.currentUserScore && localStorageService.remove('currentUserScore')
    this.props.history.push('/')
  }
  renderScores() {
    return this.state.topScorers.map((score, index) => {
      return (<div className="results__score">
          <div>{`${index + 1}.`}</div>
          <div>{score.user.toUpperCase()}</div>
          <div>{`${score.score} POINTS`}</div>
        </div>
      );
    })
  }

  sortScores() {
    this.state.ranking.sort((a, b) => {
      if(a.score < b.score) return 1;
      if(a.score > b.score) return -1;
      return 0;
    })
  }

  limitToShow() {
    const topScorers = this.state.ranking.slice(0, TOP_RANKING)
    this.setState({topScorers: topScorers})
  }

  render() {
    return (
      <div className="results">
        <h1>TOP {TOP_RANKING} SCORE CARD</h1>
        {this.renderScores()}
        <button onClick={() => this.goToHome()}>PLAY AGAIN</button>
      </div>
    );
  }
}
