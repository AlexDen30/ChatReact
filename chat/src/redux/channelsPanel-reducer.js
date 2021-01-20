import { channelsAPI } from "../api/api";

const SET_CHANNELS = 'SET_CHANNELS';
const ADD_CHANNEL = 'JOIN_CHANNEL';
const SELECT_CHANNEL = 'SELECT_CHANNEL';
const LEAVE_CHANNEL = 'LEAVE_CHANNEL'; 

const initialState = {
    channels: [],
    selectedChannelId: null,
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
            debugger;
            const index = state.channels.findIndex((ch) => ch.channelId === action.leavingId);
            return {
                ...state,
                channels: index === 0 ? [...state.channels.slice(1)] : [...state.channels.slice(0, index), ...state.channels.slice(index + 1)],
            }

        default:
            return state;
    }
}

export const leaveChannelThunkCreator = (leavingId) => (dispatch) => {

    channelsAPI.leaveChannel(leavingId)
        .then(response => {
            if (response.statusText === 'OK') {
                dispatch(leaveChannelAC(leavingId));
            } else {
                alert('Leaving error');
            }
        });
    
}

export const joinChannelThunkCreator = (joinId) => (dispatch) => {

    channelsAPI.joinChannel(joinId)
        .then(response => {
            if (response.statusText === 'OK') {
                dispatch(addChannelThunkCreator(joinId));
            } else {
                alert('Join error');
            }
        });
    
}

export const guestLeaveChannelThunkCreator = (leavingId) => (dispatch) => {

    const leave = (leavingId) => {
        dispatch(leaveChannelAC(leavingId));
    }

    leave(leavingId);

}

export const guestJoinChannelThunkCreator = (joinId) => (dispatch) => {
  
    
    const add = (joinId) => {
        dispatch(addChannelThunkCreator(joinId));
    }
    
    add(joinId);

}

const addChannelThunkCreator = (addId) => (dispatch) => {
    
    channelsAPI.getChannel(addId)
        .then(response => {
            if (response.statusText === 'OK') {
                dispatch(addChannelAC({
                    channelId: response.data.channelId,
                        name: response.data.name,
                        theme: response.data.theme,
                        creationTime: response.data.creationTime,
                        countOfMessages: response.data.countOfMessages
                        }
                        )
                    );
                alert("Successful join to " + response.data.name);
                }
            });

}


export const deleteChannelThunkCreator = (deletingId) => (dispatch) => {

    channelsAPI.deleteChannel(deletingId)
        .then(response => {
            if (response.statusText === 'OK') {
                dispatch(leaveChannelAC(deletingId));
            } else {
                alert('Deleting error');
            }
        });
}

export const setChannelsThunkCreator = () => (dispatch) => {
    
    channelsAPI.userChannels()
        .then(data => {
            if (data.statusText === 'OK') {
                dispatch(setChannelsAC(data.data.channels)); 
            } 
    
        });
}


export const createChannelThunkCreator = (name, theme, creationTime) => (dispatch) => {
    channelsAPI.createChannel(name, theme, creationTime)
    .then(response => {
        if (response.statusText === 'OK') {
            dispatch(joinChannelThunkCreator(response.data.channelId)); 
            alert("Channel was created! Channel id: " + response.data.channelId);
        } else {
            alert("Creation Error");
        }

    });
    
}
