import { messagesAPI } from "../api/api";


const SET_MESSAGES = 'SET_MESSAGES';
const ADD_MESSAGE = 'ADD_MESSAGE';
const ADD_MESSAGES = 'ADD_MESSAGES';

let initialState = {
    channelMessages: [],
    
}

export const addMessagesAC = (messages) => {
    
    return {
        type: ADD_MESSAGES,
        messages 
    }
}

export const addMessegeAC = (messageId, channelId, type, contentText, color, senderId, creationTime, numberInChat, senderUserName) => {
    return {
        type: ADD_MESSAGE,
        message: {
            messageId,
            channelId,
            type,
            contentText,
            color,
            senderId,
            creationTime,
            numberInChat,
            senderUserName
        }
    }
}


const setMessagesAC = (channelMessages = initialState.channelMessages) => {
    return {
        type: SET_MESSAGES,
        channelMessages 
    }
}



export const messagesReducer = (state = initialState, action) => {

    switch (action.type) {

        case SET_MESSAGES:
            return {
                ...state,
                channelMessages: action.channelMessages
            }
        
        case ADD_MESSAGE:
            return {
                ...state, 
                channelMessages: [...state.channelMessages, action.message]
            }  

        case ADD_MESSAGES:
            return {
                ...state,
                channelMessages: [...action.messages, ...state.channelMessages]
            }

        default:
            return state;
    }
}



export const sendMessageThunkCreator = (channelId, type, contentText, contentFile, color, creationTime) => (dispatch) => {

    messagesAPI.sendMessage(channelId, type, contentText, contentFile, color, creationTime)
        .then(response => {
            if (response.statusText !== 'OK') {
                alert("Sending Error");
            } 
        });
}

export const setMessagesThunkCreator = (channelId, from, to) => (dispatch) => {

    //from, to = 0 means that is first msgs download
    messagesAPI.getChannelMsgsBetween(from, to, channelId)
        .then(response => {
            if (response.statusText === 'OK') {
                dispatch(setMessagesAC(response.data.messages)); 
            } 
        
        });
}

export const getMoreMessagesThunkCreator = (channelId, numOfFirstMsgInClient) => (dispatch) => {

    let howMatchAdd;
    numOfFirstMsgInClient > 10 ? howMatchAdd = numOfFirstMsgInClient - 10 : howMatchAdd = 1;
    
    messagesAPI.getChannelMsgsBetween(howMatchAdd, numOfFirstMsgInClient, channelId)
        .then(response => {
            if (response.statusText === 'OK') {
                dispatch(addMessagesAC(response.data.messages)); 
            } 
        
        });
}

export const downloadMessageFileThunkCreator = (messageId, fileName) => {
    messagesAPI.downloadMessageFile(messageId)
        .then(response => {
            if (response.statusText === 'OK') {
                var fileDownload = require('js-file-download');
                fileDownload(response.data, fileName); 
            } 

        });
}

