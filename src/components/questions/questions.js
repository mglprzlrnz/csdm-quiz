import React, { Component, Fragment } from 'react';
import {localStorageService, popupService} from '../../services';
import './questions.css';

const CHANGE_LEVEL_QUESTION = 4

export class Questions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      questionNumber: 1,
      currentUser: '',
      countries: [],
      typeOfQuestion: 'code',
      country: {
        name: '',
        code: '',
      },
      optionA: '',
      optionB: '',
      optionC: '',
      optionD: '',
      disabledButtons: false,
    }
  }

  componentWillMount() {
    const currentStatus = localStorageService.get('currentStatus');
    if (currentStatus) {
      const {currentUser, questionNumber, typeOfQuestion, countries, country, optionA, optionB, optionC, optionD} = currentStatus
      this.setState({
        currentUser: currentUser, 
        questionNumber: questionNumber, 
        countries: countries,
        typeOfQuestion: typeOfQuestion,
        country: country,
        optionA: optionA,
        optionB: optionB,
        optionC: optionC,
        optionD: optionD
        })
    } else {
      this.setState({countries: localStorageService.get('countries'), currentUser: localStorageService.get('currentUser')}, () => this.getRandomCountry());
    }
  }

  goToResults() {
    this.props.history.push('/results');
  }

  getRandomCountry() {
    const {countries} = this.state;
    const randomCountry = countries[Math.floor(Math.random() * countries.length)]
    const selecetedCountry = {
      name: randomCountry.name,
      code: randomCountry.code,
      phone: randomCountry.phone
    }
    this.setState({country: selecetedCountry}, () => this.setQuestion());
  }
  
  setQuestion() {
    this.removeFromCountries()
    if (this.state.questionNumber > CHANGE_LEVEL_QUESTION) {
      const type = Math.random() > 0.5 ? 'code' : 'phone'
      this.setState({typeOfQuestion: type}, this.getDifferentOptions(type))
    } else {
      this.getDifferentOptions(this.state.typeOfQuestion)
    }
  }

  getDifferentOptions(key) {
    const {countries, country} = this.state;
    let options = [country[key]];
    
    while (options.length < 4) {
      let newOption = countries[Math.floor(Math.random() * countries.length)][key];
      if (!options.includes(newOption)) {
        options.push(newOption);
      }
    }
    this.randomizeAnswers(options)
    this.setState({optionA: options[0], optionB: options[1], optionC: options[2], optionD: options[3]}, () => this.updateLocalStorage())
  }

  updateLocalStorage() {
    const {currentUser, questionNumber, typeOfQuestion, countries, country, optionA, optionB, optionC, optionD} = this.state
    const currentStatus = {
      currentUser: currentUser,
      questionNumber: questionNumber,
      countries: countries,
      typeOfQuestion: typeOfQuestion,
      country: country,
      optionA: optionA,
      optionB: optionB,
      optionC: optionC,
      optionD: optionD,
    }
    localStorage.currentStatus && localStorageService.remove('currentStatus')
    localStorageService.set('currentStatus', currentStatus)
  }

  randomizeAnswers(options) {
    for (let i = options.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [options[i], options[j]] = [options[j], options[i]];
    }
  }

  removeFromCountries() {
    let {countries} = this.state;
    const remainingCountries = countries.filter(country => {return country.name !== this.state.country.name})
    this.setState({countries: remainingCountries});
  }

  checkAnswer({target}) {
    this.setState({disabledButtons: true})
    this.addSelectedClass(target.id)
    setTimeout(() => {
      if (this.state.typeOfQuestion === 'code') {
        target.id === this.state.country.code ? this.openPopup('correct') : this.openPopup()
      } else {
        target.id === this.state.country.phone ? this.openPopup('correct') : this.openPopup()
      }
      this.removeSelectedClass(target.id)
      this.setState({disabledButtons: false})
    }, 3000)
  }

  addSelectedClass(id) {
    document.getElementById(id).classList.add('selected')
  }

  removeSelectedClass(id) {
    document.getElementById(id).classList.remove('selected')
  }

  openPopup(status) {
    let message = ''
    let nextStep = ''
    let score = ''
    let button = ''
    let onAccept = null
    if (status) {
      message = 'WELL DONE!!!!'
      button = 'CONTINUE'
      onAccept = () => this.correctAnswer()
    } else {
      message = 'GAME OVER!!!!'
      score = `YOU SCORED: ${this.state.questionNumber-1} POINTS.`
      nextStep = 'GO TO THE SCORE CARD'
      button = 'NEXT'
      onAccept = () => this.incorrectAnswer()
    }
    popupService.open(
      <Fragment>
        <h1>{message}</h1>
        <h2>{score}</h2>
        <h3>{nextStep}</h3>
        <button className="popup__button" onClick={onAccept}>{button}</button>
      </Fragment>
    )
  }

  correctAnswer() {
    popupService.close()
    const nextQuestion = (this.state.questionNumber +1)
    this.setState({questionNumber: nextQuestion})
    this.getRandomCountry();
  }
  
  incorrectAnswer() {
    popupService.close();
    this.updateResults();
    localStorageService.remove('currentStatus')
    this.goToResults();
  }

  updateResults() {
    const scores = localStorageService.get('ranking') || [];
    localStorage.ranking && localStorageService.remove('ranking')
    const currentUserScore = {
      user: this.state.currentUser,
      score: (this.state.questionNumber-1)
    }
    scores.push(currentUserScore);
    localStorageService.set ('currentUserScore', currentUserScore)
    localStorageService.set('ranking', scores)
  }

  getQuestion() {
    return this.state.typeOfQuestion === 'code' ? 'What is the international ISO code for ' : 'What is the country code for ' 
  }


  render() {
    const {country, optionA, optionB, optionC, optionD, questionNumber, disabledButtons} = this.state;
    return (
      <div className="questions">
        <h1 className="questions__title">Question number {questionNumber}</h1>
        <h3 className="questions__question">{this.getQuestion()}<strong className="questions__country">{country.name}?</strong></h3>
        <div className="questions__answercontainer">
          <button className="questions__answer" disabled={disabledButtons} id={optionA} onClick={(ev) => this.checkAnswer(ev)}>{optionA}</button>
          <button className="questions__answer" disabled={disabledButtons} id={optionB} onClick={(ev) => this.checkAnswer(ev)}>{optionB}</button>
        </div>
        <div className="questions__answercontainer">
          <button className="questions__answer" disabled={disabledButtons} id={optionC} onClick={(ev) => this.checkAnswer(ev)}>{optionC}</button>
          <button className="questions__answer" disabled={disabledButtons} id={optionD} onClick={(ev) => this.checkAnswer(ev)}>{optionD}</button>
        </div>
      </div>
    );
  }
}
