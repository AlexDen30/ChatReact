import React from 'react';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import HeaderContainer from './Header';
import { Box, makeStyles } from '@material-ui/core';
import ChannelsInPanelContainer from './ChannelsInPanel';
import ChatBody from './ChatBody';
import { connect } from 'react-redux';
import { Redirect, Route } from 'react-router-dom';
import defaultPicture from '../../pics/grass.jpg';


const useStyles = makeStyles((theme) => ({
    paperLeft: {
        height:"600px",
        overflow: 'auto',
        borderRadius:"10px",
    },

    paperRight: {
        height:"600px",
        borderRadius:"10px",
        background: theme.palette.primary.light
    },

    mainPart: {
        paddingTop: "30px",
        paddingLeft: "15px"
        
    },

    defaultPic: {
        width: '100%',
        height: '100%',
        padding: theme.spacing(2),
        borderRadius: '4%',
    }
}));

const Main = (props) => {

    const classes = useStyles();

    

    return (
        <div>
            <HeaderContainer/>
            <Grid
                container
                className={classes.mainPart}
                spacing={5}
                direction="row"
                justify="center"
            >
                <Grid item xs={3}>
                    <Paper className={classes.paperLeft} elevation={3}>
                        <ChannelsInPanelContainer/>
                    </Paper>
                </Grid>
            
                <Grid item xs={5}>
                    <Paper className={classes.paperRight} elevation={3}>    
                        <Route 
                           exact
                           path='/main'
                           render={() => <img src={defaultPicture} className={classes.defaultPic}/>}
                        /> 
                           
                        <Route 
                           exact
                           path='/main/channel/:channelId'
                           render={(props) => <ChatBody {...props}/>}
                        /> 
                    </Paper>
                </Grid>
            </Grid>
        </div>
    );
}

const MainContainer = (props) => {

    if (!props.isAuthorized) {
        return(<Redirect to={'/login'} />)
    }

    return <Main />
}

const mapDispatchToProps = (dispatch) => {
    return {

    }
  }
  
  const mapStateToProps = (state) => {
    return {
      isAuthorized: state.authorizationData.isAuthorized,
      selectedChannel: state.selectedChanneld    
    }
  }

export default connect(mapStateToProps, mapDispatchToProps)(MainContainer);