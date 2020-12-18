import React from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { NavLink, Redirect } from 'react-router-dom';
import { useForm } from './hooks/useForm';
import { connect } from 'react-redux';
import { signupThunkCreator } from '../redux/authorization-reducer';


const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  form: {
    width: '100%', 
    marginTop: theme.spacing(3),
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
          Sign up
        </Typography>
        <form className={classes.form} autoComplete="off">
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                value={props.values.firstName}
                onChange={props.handleInputChange}
                error={props.errors.firstName}
                helperText={props.errors.firstName}
                name="firstName"
                variant="outlined"
                required
                fullWidth
                id="firstName"
                label="First Name"
                autoFocus
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                value={props.values.lastName}
                onChange={props.handleInputChange}
                error={props.errors.lastName}
                helperText={props.errors.lastName}
                variant="outlined"
                required
                fullWidth
                id="lastName"
                label="Last Name"
                name="lastName"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                value={props.values.birthDate}
                onChange={props.handleInputChange}
                error={props.errors.birthDate}
                helperText={props.errors.birthDate}
                variant="outlined"
                required
                fullWidth
                id="birthDate"
                label="birthDate"
                name="birthDate"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                value={props.values.userName}
                onChange={props.handleInputChange}
                error={props.errors.userName}
                helperText={props.errors.userName}
                variant="outlined"
                required
                fullWidth
                id="userName"
                label="userName"
                name="userName"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                value={props.values.email}
                onChange={props.handleInputChange}
                error={props.errors.email}
                helperText={props.errors.email}
                variant="outlined"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                value={props.values.password}
                onChange={props.handleInputChange}
                error={props.errors.password}
                helperText={props.errors.password}
                variant="outlined"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
              />
            </Grid>
          </Grid>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={props.handleSubmit}
          >
            Sign Up
          </Button>
          
          <Button
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            component={NavLink}
            to="/login"
          >
            Already have an account? Sign in here
          </Button>
        
        </form>
      </div>
      
    </Container>
  )
}

const initialFormValues = {
  email: '',
  password: '',
  firstName: '',
  lastName: '',
  birthDate: '',
  userName: ''
}

const SignUpPage = (props) => {

  const validate = (fieldValues = values) => {
    let temp = { ...errors };
    if ('email' in fieldValues)
      temp.email = (/$^|.+@.+../).test(fieldValues.email) ? "" : "Email is not valid";
    if ('password' in fieldValues)
      temp.password = fieldValues.password.length > 4 ? "" : "Password must contains more than 4 characters";
    if ('firstName' in fieldValues)
      temp.firstName = fieldValues.firstName.length > 1 ? "" : "Name must contains more than 1 characters";
    if ('lastName' in fieldValues)
      temp.lastName = fieldValues.lastName.length > 1 ? "" : "Last name must contains more than 1 characters";
    if ('birthDate' in fieldValues)
      temp.birthDate = (/^([0-9]{2}).([0-9]{2}).([0-9]{4})$/).test(fieldValues.birthDate) ? "" : "Birth date is not valid";
    if ('userName' in fieldValues)
      temp.userName = fieldValues.userName.length > 4 ? "" : "Username must contains more then 4 characters";

    setErrors({
      ...temp
    })

    if (fieldValues === values)
      return Object.values(temp).every(x => x === "");
  }

  const { values, setValues, errors, setErrors, handleInputChange } = useForm(initialFormValues, true, validate);

  const handleSubmit = () => {
    if (validate()) {
      //userName, email, firstName, secondName, birthDate, password
      props.signup(values.userName, values.email, values.firstName, values.lastName, values.birthDate, values.password);
    }
  }

  if (props.isAuthorized) {
    return (<Redirect to={'/main'} />);
  }


  return (
    <LoginForm 
      handleInputChange={handleInputChange}
      values={values}
      errors={errors}
      handleSubmit={handleSubmit}
    />
  );
}

const mapDispatchToProps = () => {
  return {
      signup: (userName, email, firstName, secondName, birthDate, password) => {
          signupThunkCreator(userName, email, firstName, secondName, birthDate, password);
      }
  }
}

export default connect(null, mapDispatchToProps)(SignUpPage);