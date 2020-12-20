import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { ListSubheader } from '@material-ui/core';
import { Button } from '@material-ui/core';
import { connect } from 'react-redux';
import { setMessagesThunkCreator } from '../../redux/messages-reducer';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

const useStyles = makeStyles((theme) => ({
    
    avatar: {
        width: theme.spacing(2),
        height: theme.spacing(2),
    },

    messageArea: {
        backgroundColor: theme.palette.background.paper,
    },

    subheader: {
        width: '100%',
        height: theme.spacing(4),
    },

}));



const Messages = (props) => {
    
    const classes = useStyles();

    useEffect(() => {
        if (props.countOfChannelMessages > 10){
            props.setMessages(props.currentChannelId,props.countOfChannelMessages - 10, props.countOfChannelMessages)
        } else {
            props.setMessages(props.currentChannelId, 1, props.countOfChannelMessages)
        }
        
    }, [props.selectedChID])

    return (
        <div>      
            <List className={classes.messageArea}>
                <ListSubheader component={Button}  className={classes.subheader}>
                    More Messages
                </ListSubheader>
                {
                    props.messages.map((msg) => {
                        return (
                            <ListItem key={msg.id}>
                            <ListItemText 
                                style = {msg.color === 'default'? {backgroundColor:''} : {backgroundColor:('#' + msg.color).toUpperCase()}}
                                align={props.currentUserName===msg.senderUserName?"right":"left"} 
                                primary={msg.contentText} 
                                primaryTypographyProps={{color: "#000000"}}
                                secondary={msg.senderUserName + ", " + msg.creationTime}
                            />
                            </ListItem>
                        )
                    })
                }
            </List>
        </div>
    );
}


const mapStateToProps = (state) => {

    let index;
    if (!state.channelsList.selectedChannelId) {
        return {};
    } else {
        index = state.channelsList.channels.findIndex(ch => ch.channelId === state.channelsList.selectedChannelId)
    }

    return {
        selectedChID : state.channelsList.selectedChannelId,
        messages: state.messagesData.channelMessages,
        currentUserName: state.authorizationData.userName,
        countOfChannelMessages: state.channelsList.channels[index].countOfMessages,
    }
    
}

const mapDispatchToProps = (dispatch) => {
    return {
        setMessages: (currentChannelId, from, to) => {
            dispatch(setMessagesThunkCreator(currentChannelId, from, to))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Messages);