import React from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { useForm } from './hooks/useForm';
import { loginThunkCreator } from '../redux/authorization-reducer';
import { connect } from 'react-redux';
import { NavLink, Redirect } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  form: {
    width: '100%',
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));


const LoginForm = (props) => {

  const classes = useStyles();

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Typography component="h1" variant="h5">
          Sign in
          </Typography>
        <form className={classes.form} autoComplete="off">
          <TextField
            value={props.values.email}
            onChange={props.handleInputChange}
            error={props.errors.email}
            helperText={props.errors.email}
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoFocus
          />
          <TextField
            value={props.values.password}
            onChange={props.handleInputChange}
            error={props.errors.password}
            helperText={props.errors.password}
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
          />
          <Button
            onClick={props.handleSignIn}
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Sign In
            </Button>
          <Button
            onClick={props.handleSignInGuest}
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Sign In Like a guest
            </Button>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            component={NavLink}
            to="/signup"
          >
            Sign Up
            </Button>
        </form>
      </div>
    </Container>
  )
}

const initialFormValues = {
  email: '',
  password: ''
}

const LoginPage = (props) => {

  const validate = (fieldValues = values) => {
    let temp = { ...errors };
    if ('email' in fieldValues)
      temp.email = (/$^|.+@.+../).test(fieldValues.email) ? "" : "Email is not valid";
    if ('password' in fieldValues)
      temp.password = fieldValues.password.length > 4 ? "" : "Password must contains more than 4 characters"
    setErrors({
      ...temp
    })

    if (fieldValues === values)
      return Object.values(temp).every(x => x === "");
  }

  const { values, setValues, errors, setErrors, handleInputChange } = useForm(initialFormValues, true, validate);

  if (props.isAuthorized) {
    return (<Redirect to={'/main'} />);
  }

  const handleSignIn = (e) => {
    e.preventDefault();
    if (validate()) {
      props.login(values.email, values.password);
    }
  }

  const handleSignInGuest = () => {
    props.loginGuest();
  }


  return (
    <LoginForm
      handleInputChange={handleInputChange}
      handleSignIn={handleSignIn}
      handleSignInGuest={handleSignInGuest}
      values={values}
      errors={errors}
    />
  );
}

const mapDispatchToProps = (dispatch) => {
  return {
    login: (email, password) => {
      dispatch(loginThunkCreator(email, password));
    },

    loginGuest: () => {
      dispatch(loginThunkCreator('guest', 'guest'));
    },
  }
}

const mapStateToProps = (state) => {
  return {
    isAuthorized: state.authorizationData.isAuthorized
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginPage);

