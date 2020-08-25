import React, { Component } from "react";
import { BrowserRouter as Router, Route } from 'react-router-dom';
import DiningRoom from './components/diningRoom/DiningRoom';
import LoginForm from './components/login/LoginForm';
class App extends Component {

  render() {
    return (
      <Router>
        <Route path="/" exact component={DiningRoom} />
        <Route path="/login" component={LoginForm} />
      </Router>
    );
  }
}
export default App;
