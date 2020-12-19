import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import Avatar from '@material-ui/core/Avatar';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { ListSubheader } from '@material-ui/core';
import { NavLink } from 'react-router-dom';
import { deleteChannelThunkCreator, leaveChannelThunkCreator, selectChannelAC, setChannelsThunkCreator } from '../../redux/channelsPanel-reducer';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import AlertQuestion from '../utilityComponents/AlertQuestion';
import { useAlertQuestion } from '../hooks/useAlertQuestion';

const useStyles = makeStyles((theme) => ({
    channelItem: {
        padding: theme.spacing(2),
        display: "flex",
        flexDirection: 'column',
    },

    channelPaper: {
        borderRadius: "10px",
        textAlign: "center",
    },

    insideItem: {
        padding: theme.spacing(1),
    },

    root: {
        backgroundColor: theme.palette.background.paper,
      },

}));

const ChannelsInPanel = (props) => {

    const classes = useStyles();

    useEffect(() => {
        props.setChannels(props.userId)
    }, [])

    return (
        <div>
            <List className={classes.root} >
                <ListSubheader color="primary">
                <ListItem button key={props.userName}>
                    <ListItemIcon>
                        <Avatar alt={props.userName} />
                    </ListItemIcon>
                    <ListItemText primary={props.userName}>{props.userName}</ListItemText>
                </ListItem>
                </ListSubheader>
                <Divider />
                {
                    props.channels.map((ch) => {
                        return (
                            <div>
                                <ListItem 
                                    component={NavLink} 
                                    to={`/main/channel/${ch.channelId}`} 
                                    button 
                                    onClick={() => {props.selectChannel(ch.channelId)}}
                                    onContextMenu={(e) => props.handleChannelMenu(ch.channelId, e)}
                                    key={ch.channelId} 
                                >
                                    <ListItemIcon>
                                        <Avatar alt={ch.name}  />
                                    </ListItemIcon>
                                    <ListItemText primary={ch.name}>{ch.name}</ListItemText>
                                </ListItem>
                            </div>
                        )
                    })
                }
            </List>
        </div>
    )
}

const initialState = {
    mouseX: null,
    mouseY: null,
};

const ChannelsInPanelContainer = (props) => {

    const [state, setState] = useState(initialState);

    const [openAlertleave, setOpenAlertLeave] = useState(false);

    const [openAlertDelete, setOpenAlertDelete] = useState(false);

    const [idOnMenu, setIdOnMenu] = useState(null);

    const handleChannelMenu = (channelId, event) => {
        event.preventDefault();
        setIdOnMenu(channelId);
        setState({
            mouseX: event.clientX,
            mouseY: event.clientY,
        })
    }

    const handleCloseMenu = (result) => {

        setState(initialState);

        switch (result) {
            case "LeaveChannel":
                setOpenAlertLeave(true);
                break;
            case "DeleteChannel":
                setOpenAlertDelete(true);
                break;
            default: 
                break;
        }
        
    }

    const handleCloseAlertLeave = (result) => {
        setOpenAlertLeave(false);

        if (result) {
            if (idOnMenu === props.selectedChannel) {
                props.selectChannel(null);
            }
            props.leaveChannel(idOnMenu);
        }
    };

    const handleCloseAlertDelete = (result) => {
        setOpenAlertDelete(false);
        
        if (result) {
            if (idOnMenu === props.selectedChannel) {
                props.selectChannel(null);
            }
            props.deleteChannel(idOnMenu);
        }
    };

    return (
        <div>
            <ChannelsInPanel
                handleChannelMenu={handleChannelMenu}
                channels={props.channels}
                userName={props.userName}
                userId={props.userId}
                selectChannel={props.selectChannel}
                setChannels={props.setChannels}
            />
            <Menu
                keepMounted
                open={state.mouseY !== null}
                onClose={handleCloseMenu}
                anchorReference="anchorPosition"
                anchorPosition={
                state.mouseY !== null && state.mouseX !== null
                    ? { top: state.mouseY, left: state.mouseX }
                    : undefined
                }
            >
                <MenuItem onClick={() => handleCloseMenu("LeaveChannel")}>Leave</MenuItem>
                <MenuItem onClick={() => handleCloseMenu("DeleteChannel")}>Delete</MenuItem>
            </Menu>
            <AlertQuestion 
                open={openAlertleave} 
                handleClose={handleCloseAlertLeave}
                title={"Do you really want to leave this channel?"}
                linkTo = {idOnMenu === props.selectedChannel ? "/main" : null}
            />
            <AlertQuestion 
                open={openAlertDelete} 
                handleClose={handleCloseAlertDelete}
                title={"Do you really want to DELETE this channel?"}
                linkTo = {idOnMenu === props.selectedChannel ? "/main" : null}
            />
        </div>
    )
}


const mapStateToProps = (state) => {
    return {
        selectedChannel: state.channelsList.selectedChannelId,
        channels: state.channelsList.channels,
        userName: state.authorizationData.userName,
        userId: state.authorizationData.userId,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        selectChannel: (channelId) => {
            dispatch(selectChannelAC(channelId));
        },

        setChannels: (userId) => {
            dispatch(setChannelsThunkCreator(userId));
        },

        leaveChannel: (leavingId) => {
            return dispatch(leaveChannelThunkCreator(leavingId));
        },

        deleteChannel: (deletingId) => {
            return dispatch(deleteChannelThunkCreator(deletingId));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ChannelsInPanelContainer);