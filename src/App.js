import React, { Component } from 'react';
import { HashRouter, Route, Switch, Redirect } from 'react-router-dom';
import {Home, Questions, Results, Popup} from './components';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
       <Popup/>
       <HashRouter>
          <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/questions" component={Questions} />
            <Route path="/results" component={Results} />
            <Redirect to="/" />
          </Switch>
        </HashRouter>
      </div>
    );
  }
}

export default App;
