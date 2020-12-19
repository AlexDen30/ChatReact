import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { Button } from '@material-ui/core';
import { connect } from 'react-redux';
import { leaveChannelThunkCreator, selectChannelAC } from '../../redux/channelsPanel-reducer';
import { NavLink } from 'react-router-dom';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';

const useStyles = makeStyles((theme) => ({
    headerInfo: {
        height: 50,
    },

    leaveButton: {
        width: '100%',
        height: 50,
        padding: theme.spacing(1)
    },

    root: {
        width: 580,
        height: 50
    }

}));

const CurrentChannelHeader = (props) => {

    const classes = useStyles();

    return (
        <div>
            <Grid
                className={classes.root}
                container
            >
                <Grid item xs={8}>
                    <ListItem key='header' className={classes.headerInfo}>
                        <ListItemText
                            primary={props.channelName + ' ⋅ ' + props.channelTheme}
                            secondary={'Created on ' + props.channelCreationTime}
                        />
                    </ListItem>
                </Grid>
                <Grid item xs={4}>
                    <Button
                        className={classes.leaveButton}
                        variant="contained"
                        color="primary"
                        onClick={props.handleLeavingChannel}
                    >
                        Leave Channel
                    </Button>
                </Grid>
            </Grid>
        </div>
    );
}

const CurrentChannelHeaderContainer = (props) => {

    const [open, setOpen] = React.useState(false);

    const handleLeavingChannel = () => {
        setOpen(true);
    };

    const handleClose = (result) => {
        setOpen(false);
        if (result) {
            props.leaveChannel(props.currentChannelId);
            props.selectChannel(null);
        }
    };

    return (
        <div>
            <CurrentChannelHeader
                channelName={props.channelName}
                channelCreationTime={props.channelCreationTime}
                channelTheme={props.channelTheme}
                handleLeavingChannel={handleLeavingChannel}
            />
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"Do you really want to leave this channel?"}</DialogTitle>
                <DialogActions>
                    <Button 
                        component={NavLink}
                        to="/main" 
                        onClick={() => handleClose(true)} 
                        color="primary"
                    >
                        Yes
                    </Button>
                    <Button onClick={() => handleClose(false)} color="primary" autoFocus>
                        No
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

const mapStateToProps = (state) => {

    let index;
    debugger;
    if (!state.channelsList.selectedChannelId) {
        return {};
    } else {
        index = state.channelsList.channels.findIndex(ch => ch.channelId === state.channelsList.selectedChannelId)
    }

    return {
        channelName: state.channelsList.channels[index].name,
        channelCreationTime: state.channelsList.channels[index].creationTime,
        channelTheme: state.channelsList.channels[index].theme,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        leaveChannel: (leavingId) => {
            return dispatch(leaveChannelThunkCreator(leavingId));
        },

        selectChannel: (channelId) => {
            dispatch(selectChannelAC(channelId));
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CurrentChannelHeaderContainer);