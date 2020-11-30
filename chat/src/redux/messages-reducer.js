

const SET_MESSAGES = 'SET_MESSAGES';
const GET_MORE_MESSAGES = 'GET_MORE_MESSAGES';
const SEND_MESSAGE = 'SEND_MESSAGE';
const UPDATE_MESSAGES = 'UPDATE_MESSAGES';

let initialState = {
    channelMessages: [
        {content: 'asdasdas', time: '9:25', id: '0', sender: 'sasha'},
        {content: 'asdasdas', time: '9:25', id: '1', sender: 'current'},
        {content: 'asdasdas', time: '9:25', id: '2', sender: 'sasha'},
        {content: 'asdasdas', time: '9:25', id: '3', sender: 'sasha'},
        {content: 'asdasdas', time: '9:25', id: '4', sender: 'current'},
        {content: 'asdasdas', time: '9:25', id: '5', sender: 'current'},
        {content: 'asdasdas', time: '9:25', id: '6', sender: 'sasha'},
    ]
}


const sendMessageAC = (msgContent, sendTime, msgId, sender) => {
    return {
        type: SEND_MESSAGE,
        message: {
            content: msgContent,
            time: sendTime,
            id: msgId,
            sender
        }
    }
}

const updateMessagesAC = (newMsgs) => {
    return {
        type: UPDATE_MESSAGES,
        newMessages: [...newMsgs]
    }
}

const getMoreMessagesAC = (msgs) => {
    return {
        type: GET_MORE_MESSAGES,
        messages: [...msgs]
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

        case GET_MORE_MESSAGES:
            return {
                ...state,
                channelMessages: [...action.messages].push(...state.channelMessages)
            }

        case UPDATE_MESSAGES:
            return {
                ...state,
                channelMessages: [...state.channelMessages, action.newMessages]
            }

        case SEND_MESSAGE:
            return {
                ...state, 
                channelMessages: [...state.channelMessages, action.message]
            }    

        default:
            return state;
    }
}


export const sendMessageThunkCreator = (msgContent, sendTime, sender) => (dispatch) => {
    //api post if successed
    let msgId;
    if (initialState.channelMessages.length == 0) {
        msgId = 0;
    } else {
        msgId = initialState.channelMessages[initialState.channelMessages.length - 1].id + 1;
    }
   
    return dispatch(sendMessageAC(msgContent, sendTime, msgId, sender));
}

export const getMoreMessagesThunkCreator = () => (dispatch) => {
    //api
    //return dispatch(getMoreMessagesAC(msgs));
}

export const updateMessagesThunkCreator = () => (dispatch) => {
    //api
    //return dispatch(getMoreMessagesAC(msgs));
}

export const setMessagesThunkCreator = (channelId) => (dispatch) => {

    // return authAPI.me()
    //     .then(data => {
    //         if (data.resultCode === 0) {
    //             dispatch(setAuthUserData(data.data.id, data.data.email, data.data.login, true));
    //         }
    //     });
    //return dispatch(setAuthUserData('data.id',' data.email', 'data.login', true));
    return dispatch(setMessagesAC());
}



