import { messagesAPI } from "../api/api";

const SET_MESSAGES = 'SET_MESSAGES';
//const GET_MORE_MESSAGES = 'GET_MORE_MESSAGES';
//const SEND_MESSAGE = 'SEND_MESSAGE';
//const UPDATE_MESSAGES = 'UPDATE_MESSAGES';
const ADD_MESSAGE = 'ADD_MESSAGE';
//const FILE = 'FILE';

// if msg is file bgcolor=lightblue and content is file name
// to download you chould double click it in chat
let initialState = {
    channelMessages: [],
    // channelMessages: [
    //     {content: 'asdasdas', type: 'text', bgColor: 'default', time: '9:25', id: '0', sender: 'sasha'},
    //     {content: 'asdasdas', type: 'text', bgColor: 'default', time: '9:25', id: '1', sender: 'current'},
    //     {content: 'asdasdas', type: 'text', bgColor: 'default', time: '9:25', id: '2', sender: 'sasha'},
    //     {content: 'asdasdas', type: 'text', bgColor: 'red', time: '9:25', id: '3', sender: 'sasha'},
    //     {content: 'asdasdas', type: 'text', bgColor: 'default', time: '9:25', id: '4', sender: 'current'},
    //     {content: 'asdasdas', type: 'text', bgColor: 'green', time: '9:25', id: '5', sender: 'current'},
    //     {content: 'asdasdas', type: 'text', bgColor: 'default', time: '9:25', id: '6', sender: 'sasha'},
    // ],
    //file: null
}


const addMessegeAC = (channelId, type, contentText, contentFile, color, creationTime) => {
    return {
        type: ADD_MESSAGE,
        message: {
            channelId,
            type,
            contentText,
            contentFile,
            color,
            creationTime
        }
    }
}

// const updateMessagesAC = (newMsgs) => {
//     return {
//         type: UPDATE_MESSAGES,
//         newMessages: [...newMsgs]
//     }
// }

// const getMoreMessagesAC = (msgs) => {
//     return {
//         type: GET_MORE_MESSAGES,
//         messages: [...msgs]
//     }
// }

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

        // case GET_MORE_MESSAGES:
        //     return {
        //         ...state,
        //         channelMessages: [...action.messages].push(...state.channelMessages)
        //     }

        // case UPDATE_MESSAGES:
        //     return {
        //         ...state,
        //         channelMessages: [...state.channelMessages, action.newMessages]
        //     }

        // case SEND_MESSAGE:
        //     return {
        //         ...state, 
        //         channelMessages: [...state.channelMessages, action.message]
        //     }    
        
        case ADD_MESSAGE:
            return {
                ...state, 
                channelMessages: [...state.channelMessages, action.message]
            }  

        // case FILE:
        // return {
        //     ...state, 
        //     file: action.file
        // }
        default:
            return state;
    }
}


// export const sendMessageThunkCreator = (msgContent, sendTime, sender, bgColor) => (dispatch) => {
//     //api post if successed
//     let msgId;
//     if (initialState.channelMessages.length == 0) {
//         msgId = 0;
//     } else {
//         msgId = initialState.channelMessages[initialState.channelMessages.length - 1].id + 1;
//     }
   
//     dispatch(sendMessageAC(msgContent, 'text', bgColor, sendTime, msgId, sender));
// }

// const fileAC = (file) => {
//     return {
//         type: FILE,
//         file
//     }
// }

// export const uploadThunkCreator = (msgContent, sendTime, sender) => (dispatch) => {
//     //api post if successed
//     let msgId;
//     if (initialState.channelMessages.length == 0) {
//         msgId = 0;
//     } else {
//         msgId = initialState.channelMessages[initialState.channelMessages.length - 1].id + 1;
//     }
   
//     dispatch(sendMessageAC(msgContent.name, 'file', 'aquamarine', sendTime, msgId, sender));
//     dispatch(fileAC(msgContent));
// }

export const getMoreMessagesThunkCreator = () => (dispatch) => {
    //api
    //return dispatch(getMoreMessagesAC(msgs));
}

export const updateMessagesThunkCreator = () => (dispatch) => {
    //api
    //return dispatch(getMoreMessagesAC(msgs));
}

export const sendMessageThunkCreator = (channelId, type, contentText, contentFile, color, creationTime) => (dispatch) => {
debugger;
    messagesAPI.sendMessage(channelId, type, contentText, contentFile, color, creationTime)
        .then(response => {
            if (response.statusText === 'OK') {
                dispatch(addMessegeAC(channelId, type, contentText, contentFile, color, creationTime));
    
            } else {
                alert("Sending Error");
            } 
            
        });
    //api
    //dispatch(addMessegeAC(channelId, type, contentText, contentFile, color, creationTime));
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

export const downloadMessageFileThunkCreator = (messageId, fileName) => {

    messagesAPI.downloadMessageFile(messageId)
        .then(response => {
            if (response.statusText === 'OK') {
                var fileDownload = require('js-file-download');
                fileDownload(response.data, fileName); 
            } 

        });
}

