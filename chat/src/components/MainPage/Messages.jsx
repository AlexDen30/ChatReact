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
        props.setMessages(props.currentChannelId)
    }, [])

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
                                style = {msg.bgColor === 'default'? {backgroundColor:''} : {backgroundColor: msg.bgColor}}
                                align={props.currentUserName===msg.sender?"right":"left"} 
                                primary={msg.content} 
                                primaryTypographyProps={{color: "#000000"}}
                                secondary={msg.sender + ", " + msg.time}
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
    return {
        messages: state.messagesData.channelMessages,
        currentUserName: state.authorizationData.userName
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        setMessages: (currentChannelId) => {
            dispatch(setMessagesThunkCreator(currentChannelId))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Messages);