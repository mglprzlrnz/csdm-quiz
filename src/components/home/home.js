import React, { Component } from 'react';
import {localStorageService, client} from '../../services';
import gql from 'graphql-tag';
import './home.css';

export class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
    }
  }

  componentWillMount() {
    localStorage.currentStatus && localStorageService.remove('currentStatus')
    localStorage.countries && localStorageService.remove('countries')
    localStorage.currentUser && localStorageService.remove('currentUser')
    localStorage.currentUserScore && localStorageService.remove('currentUserScore')
    
    const countryQuery = gql`
        query CountriesApp {
          countries {
            name
            code
            phone
          }
        }
    `;
    this.setDataToLocalStorage(countryQuery, 'countries')
  }

  setDataToLocalStorage(query, key) {
    client.query({
      query: query
    })
    .then(({data}) => {
      localStorageService.set(key, data.countries)
    })
    .catch(error => console.error(error));
  }

  updateName(ev) {
    this.setState({name: ev.target.value})
  }

  goToQuestions() {
    localStorageService.set('currentUser', this.state.name)
    this.props.history.push('/questions')
  }

  render() {
    const {name} = this.state
    const isButtonDisabled= name.length <= 0 
    return (
      <div className="home">
        <h1 className="home__title">TEST YOUR KNOWLEDGE OF <br/> ISO AND COUNTRY CODES</h1>
        <img className="home__img" src="https://i.giphy.com/media/l3V0megwbBeETMgZa/giphy.webp" alt=""></img>

        <h3 className="home__subtitle">ENTER PLAYER NAME</h3>
        <form className="home__form">
            <input 
              className="home__form__item"
              name="name"
              type="text"
              onChange={(ev) => this.updateName(ev)}
              ></input>
            <button className="home__form__item" disabled={isButtonDisabled} onClick={() => this.goToQuestions()}>Start the quiz</button>
          </form>
      </div>
    );
  }
}
