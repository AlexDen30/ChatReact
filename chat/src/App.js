import React, { useEffect } from 'react';
import LoginPage from './components/LoginPage';
import MainContainer from './components/MainPage/Main';
import SignUpPage from './components/SignUpPage';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { green, orange, red, teal } from '@material-ui/core/colors';
import { Redirect, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import { setAuthUserDataThunkCreator } from './redux/authorization-reducer';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: green[400],
    },
    secondary: {
      main: orange[400],
    },

    typography: {
      allVariants: {
        color: red[400]
      },
    },
  }
})

const App = (props) => {

  useEffect(() => {
    props.setAuthData(); 
  }, [])

  return (
    <div>
      {
        props.isAuthorized
        ? <Redirect to='/main' />
        : <Redirect to='/login' />
      }
      <ThemeProvider theme={theme}>
        <Route path='/login'
          render={() => <LoginPage />}
        />

        <Route path='/signup'
          render={() => <SignUpPage />}
        />

        <Route path='/main'
          render={() => <MainContainer />}
        />
      </ThemeProvider>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    isAuthorized: state.authorizationData.isAuthorized,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
      setAuthData: () => {
          dispatch(setAuthUserDataThunkCreator());
      }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
