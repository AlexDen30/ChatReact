import React from 'react';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import Messages from './Messages'
import InputText from './InputText';
import { Redirect } from 'react-router-dom';
import CurrentChannelHeaderContainer from './CurrentChannelHeader';

const useStyles = makeStyles((theme) => ({

    mainPart: {
        padding: theme.spacing(2),
    },

    paperHeader: {
        width: 580,
        height: 50
    },

    paperMessages: {
        width: 580,
        height: 400,
        overflow: 'auto'
    },

    paperTools: {
        width: 580,
        height: 100
    },

    head: {
        paddingBottom: theme.spacing(1)
    },

    body: {
        paddingBottom: theme.spacing(1)
    },

    feet: {
        
    }

}));

function ChatBody(props) {

    const classes = useStyles();

    if (!props.selectedChannel) {
        <Redirect to='/main' />
    }

    return (
        <div>
            <Grid
                container
                className={classes.mainPart}
                direction="column"
            >
                <Grid item xs={1} className={classes.head}>
                    <Paper className={classes.paperHeader} elevation={2}>
                        <CurrentChannelHeaderContainer currentChannelId ={props.match.params.channelId}/>
                    </Paper>
                </Grid>
                <Grid item xs={7} className={classes.body} >
                    <Paper className={classes.paperMessages} elevation={2}>
                        <Messages currentChannelId ={props.match.params.channelId}/>
                    </Paper>
                </Grid>
                <Grid item xs={2} className={classes.feet}>
                    <Paper className={classes.paperTools} elevation={2}>
                        <InputText/>
                    </Paper>
                </Grid>
            </Grid>
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        selectedChannel: state.selectedChanneld
    }
}

export default connect(mapStateToProps)(ChatBody);