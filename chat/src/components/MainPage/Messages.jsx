import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { ListSubheader } from '@material-ui/core';
import { Button } from '@material-ui/core';
import { connect } from 'react-redux';
import { addMessegeAC, downloadMessageFileThunkCreator, getMoreMessagesThunkCreator, setMessagesThunkCreator } from '../../redux/messages-reducer';
import GetAppIcon from '@material-ui/icons/GetApp';
import { HubConnectionBuilder } from '@aspnet/signalr';



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

    const [ connection, setConnection ] = useState(null);

    useEffect(() => {

        const newConnection = new HubConnectionBuilder()
            .withUrl('https://localhost:44366/Hub')
            .build();
            setConnection(newConnection);
    }, [])

    useEffect(() => {

        if (props.countOfChannelMessages > 10){
            props.setMessages(props.currentChannelId,props.countOfChannelMessages - 10, props.countOfChannelMessages)
        } else {
            props.setMessages(props.currentChannelId, 1, props.countOfChannelMessages)
        }
  
    }, [props.selectedChID])
    

    useEffect(() => {
        if (connection) {
            connection.start()
                .then(() => {
                    console.log('Connected!');
    
                    connection.on('newMsg', message => {
                        
                        props.reciveMessage(message.channelId, message.type, message.contentText, 
                            message.contentFile, message.color, message.creationTime, message.senderUserName);
                        console.log(message);
                    });
                })
                .catch(e => console.log('Connection failed: ', e));
        }
    }, [connection]);

    

    return (
        <div>      
            <List className={classes.messageArea}>
                <ListSubheader 
                    component={Button} 
                    onClick={() => props.getMoreMessages(props.selectedChID, props.firstMessage.numberInChat)}  
                    className={classes.subheader}
                >
                    More Messages
                </ListSubheader>
                {
                    props.messages.map((msg) => {
                        return (
                            <ListItem key={msg.messageId}>
                            {msg.type === "file" 
                                && <GetAppIcon  
                                        onDoubleClick={msg.type === "file" ? () => props.downloadFile(msg.messageId, msg.contentText) : ()=>{} }
                                    /> 
                            }
                            <ListItemText 
                                style = {{backgroundColor:('#' + msg.color).toUpperCase()}}
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
        firstMessage: state.messagesData.channelMessages[0]
    }
    
}

const mapDispatchToProps = (dispatch) => {
    return {
        setMessages: (currentChannelId, from, to) => {
            dispatch(setMessagesThunkCreator(currentChannelId, from, to))
        },

        downloadFile: (messageId, fileName) => {
            downloadMessageFileThunkCreator(messageId, fileName);
        },

        reciveMessage: (channelId, type, contentText, contentFile, color, creationTime, senderUserName) => {
            dispatch(addMessegeAC(channelId, type, contentText, contentFile, color, creationTime, senderUserName));
        },

        getMoreMessages: (channelId, numOfFirstMsg) => {
            dispatch(getMoreMessagesThunkCreator(channelId, numOfFirstMsg));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Messages);