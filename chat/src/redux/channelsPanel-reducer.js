
const SET_CHANNELS = 'SET_CHANNELS';
const SELECT_CHANNEL = 'SELECT_CHANNEL';
const LEAVE_CHANNEL = 'LEAVE_CHANNEL'; 
const ADD_CHANNEL = 'ADD_CHANNEL'; 

const initialState = {
    channels: [
      { name: 'Vovs122', id: '1', creationTime: 'date', theme: '9000', photoURL: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/User_font_awesome.svg/1200px-User_font_awesome.svg.png' },
      { name: 'Masasda1ha', id: '2', creationTime: 'date', theme: 'efww', photoURL: '' },
      { name: 'qwdqa12', id: '3', creationTime: 'date', theme: '111', photoURL: '' },
      { name: 'sd2', id: '4', creationTime: 'date', theme: 'a6767', photoURL: ''},
      { name: 'aasQQQ12', id: '5', creationTime: 'date', theme: '4t54', photoURL: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/User_font_awesome.svg/1200px-User_font_awesome.svg.png' },
      { name: 'Kobra212', id: '6', creationTime: 'date', theme: 'erwewe', photoURL: '' },
      { name: 'qwddddd1', id: '7', creationTime: 'date', theme: 'gg', photoURL: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/User_font_awesome.svg/1200px-User_font_awesome.svg.png'},
      { name: 'asdaaa', id: '8', creationTime: 'date', theme: 'a', photoURL: '' },
      { name: 'qwddPPPP1', id: '9', creationTime: 'date', theme: 'addds', photoURL: ''},
      { name: 'yyyy', id: '10', creationTime: 'date', theme: '343', photoURL: ''},
      { name: 'erer', id: '11', creationTime: 'date', theme: '222', photoURL: ''},
      { name: 'vcbvcbv', id: '12', creationTime: 'date', theme: 'dfdfd', photoURL: ''},
      { name: 'sfdsdf', id: '13', creationTime: 'date', theme: 'asas', photoURL: ''},
    ],
    selectedChannelId: null,
    isAdmin: false
}

const setChannelsAC = (channels) => {
    return {
        type: SET_CHANNELS,
        channels
    }
}

const addChannelAC = (addingChannel) => {
    return {
        type: ADD_CHANNEL,
        addingChannel
    }
}

export const selectChannelAC = (selectedId) => {
    return {
        type: SELECT_CHANNEL,
        selectedChannelId: selectedId
    }
}

const leaveChannelAC = (leavingId) => {
    return {
        type: LEAVE_CHANNEL,
        leavingId,
    }
}

export const channelsPanelReducer = (state = initialState, action) => {

    switch (action.type) {

        case SET_CHANNELS:
            return {
                ...state,
                channels: action.channels
            }

        case ADD_CHANNEL:
            return {
                ...state,
                channels: [...state.channels, action.addingChannel]
            }

        case SELECT_CHANNEL:
            return {
                ...state,
                selectedChannelId: action.selectedChannelId
            }

        case LEAVE_CHANNEL:

            const index = state.channels.findIndex((ch) => ch.id === action.leavingId);
            return {
                ...state,
                channels: index === 0 ? [...state.channels.slice(1)] : [...state.channels.slice(0, index), ...state.channels.slice(index + 1)],
            }

        default:
            return state;
    }
}

export const leaveChannelThunkCreator = (leavingId) => (dispatch) => {
    //api leavingId---delete--->
    dispatch(leaveChannelAC(leavingId)); //or bad request
}

export const setChannelsThunkCreator = (userId) => (dispatch) => {
    //api userdId --get--> channels
    return dispatch(setChannelsAC(initialState.channels));
}

export const addChannelThunkCreator = (addingId) => (dispatch) => {
    //api addingId-----post--->
    //return dispatch(getMoreMessagesAC(msgs));
}


