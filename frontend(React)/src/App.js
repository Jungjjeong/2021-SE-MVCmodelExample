import React from 'react'
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom'
import { Navbar } from './components/Navbar'
import { About } from './components/About'
import { Tasks } from './components/Tasks'
import { Register } from './components/Register'
import { Home } from './Home'

const API = process.env.REACT_APP_API;
//components


export const App = () => {
  return (
    <Router>
      <Navbar/>
      <div className="container p-4">
        <Switch>
          <Route path="/about" component={About}/>
          <Route path="/board" component={Tasks}/>
          <Route path="/register" component={Register}/>
          <Route path="/" component={Home}/>
        </Switch>
      </div>
    </Router>
  )
}