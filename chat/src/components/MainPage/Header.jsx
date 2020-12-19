import React, { useState } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import InputBase from '@material-ui/core/InputBase';
import { fade, makeStyles } from '@material-ui/core/styles';
import SearchIcon from '@material-ui/icons/Search';
import { Button } from '@material-ui/core';
import { connect } from 'react-redux';
import { logoutThunkCreator } from '../../redux/authorization-reducer';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { useForm } from '../hooks/useForm';
import TextField from '@material-ui/core/TextField';
import { createChannelThunkCreator, joinChannelThunkCreator } from '../../redux/channelsPanel-reducer';


const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    title: { 
      padding: '5px',
      flexGrow: 1,
      display: 'none',
      [theme.breakpoints.up('sm')]: {
        display: 'block',
      },
    },
    search: {
      
      position: 'relative',
      borderRadius: theme.shape.borderRadius,
      backgroundColor: fade(theme.palette.common.white, 0.15),
      '&:hover': {
        backgroundColor: fade(theme.palette.common.white, 0.25),
      },
      marginLeft: 0,
      width: '100%',
      [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(1),
        width: 'auto',
      },
    },
    searchIcon: {
      padding: theme.spacing(0, 2),
      height: '100%',
      position: 'absolute',
      pointerEvents: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    inputRoot: {
      color: 'inherit',
    },
    inputInput: {
      padding: theme.spacing(1, 1, 1, 0),
      paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
      transition: theme.transitions.create('width'),
      width: '100%',
      [theme.breakpoints.up('sm')]: {
        width: '12ch',
        '&:focus': {
          width: '20ch',
        },
      },
    },
    logoutButton: {

    }
  }));



const Header = (props) => {
    const classes = useStyles();
  
    return (
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar>
            <div className={classes.search}>
              <div className={classes.searchIcon}>
                <SearchIcon />
              </div>
              <InputBase
                placeholder="Join id..."
                classes={{
                  root: classes.inputRoot,
                  input: classes.inputInput,
                }}
                onChange={props.handleJoinInputChange}
                value={props.joinChId}
                inputProps={{ 'aria-label': 'search' }}
              />
            </div>
            <Button 
            onClick={props.handleJoinChannel}
            variant="contained"
            color="primary"
            className={classes.logoutButton}
            >
                Join 
            </Button>
            <Button 
            onClick={props.handleCreateChannel}
            variant="contained"
            color="primary"
            className={classes.logoutButton}
            >
                Create Channel
            </Button>
            <Typography className={classes.title} variant="h6" noWrap align="center">
              Chatting
            </Typography>
            <Button 
            onClick={props.handleSignOut}
            variant="contained"
            color="primary"
            className={classes.logoutButton}
            >
                Logout
            </Button>
            
          </Toolbar>
          
        </AppBar>
      </div>
    );
  }

  const initialFormValues = {
    name: '',
    theme: ''
  }

  const HeaderContainer = (props) => {

    const [joinChId, SetJoinChID] = useState("");

    const validate = (fieldValues = values) => {
      let temp = { ...errors };
      if ('name' in fieldValues)
        temp.name = fieldValues.name.length > 4 ? "" : "> 4 characters"
      if ('theme' in fieldValues)
        temp.theme = fieldValues.theme.length > 6 ? "" : "> 6 characters"
      setErrors({
        ...temp
      })
  
      if (fieldValues === values)
        return Object.values(temp).every(x => x === "");
    }
    const handleSignOut = () => {
        return props.logout();
    }

    const handleCreateChannel = () => {
        SetOpenCrDialog(true);
    }

    const handleJoinChannel = () => {

        if (joinChId > 0) {

          let hasSameId = false;
          let id = Number.parseInt(joinChId);
          props.channels.forEach(element => {
            if ( element.channelId === id) {
              hasSameId = true;
            }
          });

          if(!hasSameId) {
            props.joinChannel(joinChId);
            SetJoinChID("");
          } else {
            alert("You have already joined to this channel!")
          }
          
        }
        
    }

    const handleJoinInputChange = (e) => {
        SetJoinChID(e.target.value);
    }

    const handleCloseCrDialog = (resp) => {
    
        if (resp === "close") {
          SetOpenCrDialog(false);
        }

        if (resp === "create") {
            SetOpenCrDialog(false);

            if (validate()) {
              let date = new Date();
              let dateToSend = date.getDate() + '.' + (date.getMonth()+1) + '.' + date.getFullYear() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
              props.createChannel(values.name, values.theme, dateToSend);
            }
            
        }
    }

    const { values, setValues, errors, setErrors, handleInputChange } = useForm(initialFormValues, true, validate);

    const [isOpenCrDialog, SetOpenCrDialog] = useState(false);

    return (
    <div>
        <Header 
          handleSignOut={handleSignOut}
          handleCreateChannel={handleCreateChannel}   
          handleJoinChannel={handleJoinChannel}
          handleJoinInputChange={handleJoinInputChange}
          joinChId={joinChId}
        />
        <Dialog
              open={isOpenCrDialog}
              onClose={handleCloseCrDialog}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
          >
              <DialogTitle id="alert-dialog-title">{"Create new channel:"}</DialogTitle>
              <DialogContent>
                <TextField 
                  value={values.name}
                  onChange={handleInputChange}
                  error={errors.name}
                  helperText={errors.name}
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  name="name"
                  label="name"
                  type="name"
                  id="name"
                />
                <TextField
                  value={values.theme}
                  onChange={handleInputChange}
                  error={errors.theme}
                  helperText={errors.theme}
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  name="theme"
                  label="theme"
                  type="theme"
                  id="theme"
                />
              </DialogContent>
              <DialogActions>
              <Button onClick={() => handleCloseCrDialog("close")} color="primary">
                  Close
              </Button>
              <Button onClick={() => handleCloseCrDialog("create")} color="primary" autoFocus>
                  Create
              </Button>
              </DialogActions>
          </Dialog>
    </div>
    );
  }

  const mapDispatchToProps = (dispatch) => {
    return {
      logout: () => {
        dispatch(logoutThunkCreator());
      },

      createChannel: (name, theme, creationTime) => {
        dispatch(createChannelThunkCreator(name, theme, creationTime));
      },
      
      joinChannel: (chId) => {
        dispatch(joinChannelThunkCreator(chId));
      },
    }
  }
  
  const mapStateToProps = (state) => {
    return {
      isAuthorized: state.authorizationData.isAuthorized,
      channels: state.channelsList.channels    
    }
  }

  export default connect(mapStateToProps, mapDispatchToProps)(HeaderContainer);