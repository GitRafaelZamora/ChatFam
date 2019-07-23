import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import jwtDecode from 'jwt-decode';
import axios from 'axios';

import './App.css';

// Redux
import {Provider} from 'react-redux'
import store from './redux/store.js'
import { SET_AUTHENTICATED, } from './redux/types'
import { logoutUser, getUserData } from './redux/actions/userActions'

// MUI Stuff
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
import AuthRoute from './util/AuthRoute';

// Components
import Navbar from './components/Navbar';

//Pages
import home from './pages/home';
import login from './pages/login';
import signup from './pages/signup';
import posts from './pages/posts';
import characters from './pages/characters';


const theme = createMuiTheme({
  palette: {
    primary: {
      light: '#33c9dc',
      main: '#00bcd4',
      dark: '#008394',
      contrastText: '#fff'
    },
    secondary: {
      light: '#ff6333',
      main: '#ff3d00',
      dark: '#b22a00',
      contrastText: '#fff'
    }
  }
});

const token = localStorage.FBIdToken;

if (token) {
  const decodedToken = jwtDecode(token);
  console.log(decodedToken);
  if (decodedToken.exp * 1000 < Date.now()) {
    store.dispatch( logoutUser() )
    window.location.href = '/login';
  } else {
    store.dispatch({ type: SET_AUTHENTICATED });
    axios.defaults.headers.common['Authorization'] = token;
    store.dispatch(getUserData());
  }
}

function App() {
  return (
    <MuiThemeProvider theme={theme}>
      <Provider store={store}>
        <Router>
          <Navbar />
          <div className="container">
            <Switch> 
              <Route exact path="/" component={ home } />
              <AuthRoute exact path="/login" component={ login } />
              <AuthRoute exact path="/signup" component={ signup } />
              <Route exact path="/posts" component={ posts } />
              <Route exact path="/characters" component={ characters } />
            </Switch>
          </div>
        </Router>
      </Provider>
    </MuiThemeProvider>
  );
}

export default App;
