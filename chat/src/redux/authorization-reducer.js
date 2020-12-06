//import { authAPI } from "../api/api";
//import { stopSubmit } from 'redux-form';

const SET_USER_DATA = 'SET_USER_DATA'
const TOOGLE_IS_FETCHING = 'TOOGLE_IS_FETCHING';

let initialState = {
    userId: null,
    userName: null,
    email: null,
    login: null,
    ifFetching: false,
    isAuthorized: false,
    //role: null
}


export const isFetchingAC = (isFetching) => {
    return {
        type: TOOGLE_IS_FETCHING,
        isFetching,
    }
}

export const setAuthUserData = (userId, userName, email, login, isAuthorized) => {
    return {
        type: SET_USER_DATA,
        payload: {
            userId,
            userName,
            email,
            login,
            isAuthorized
        }
    }
}

export const authorizationReducer = (state = initialState, action) => {

    switch (action.type) {

        case SET_USER_DATA:
            return {
                ...state,
                ...action.payload
            }

        case TOOGLE_IS_FETCHING:
            return {
                ...state,
                isFetching: action.isFetching,
            }

        default:
            return state;
    }
}

export const setAuthUserDataThunkCreator = () => (dispatch) => {

    // return authAPI.me()
    //     .then(data => {
    //         if (data.resultCode === 0) {
    //             dispatch(setAuthUserData(data.data.id, data.data.email, data.data.login, true));
    //         }
    //     });
    return dispatch(setAuthUserData('data.id', 'current',' data.email', 'data.login', true));
}

export const setAuthGuestDataThunkCreator = () => (dispatch) => {

    return dispatch(setAuthUserData('guest', 'current','----', 'guest', true));
}

export const loginThunkCreator = (email, password) => (dispatch) => {

    // authAPI.login(email, password, rememberMe)
    //     .then(response => {
    //         if (response.data.resultCode === 0) {
    //             dispatch(setAuthUserDataThunkCreator());
    //         } else {
    //             let message = response.data.messages.length > 0 ? response.data.messages[0] : 'Err';
    //             dispatch(stopSubmit("login", { _error: message }));
    //         }
    //     });
    if (email === 'guest' && password === 'guest') {
        dispatch(setAuthGuestDataThunkCreator());
    } else {
        dispatch(setAuthUserDataThunkCreator());
    }

}


export const logoutThunkCreator = () => (dispatch) => {

    // return (dispatch) => {
    //     authAPI.logout()
    //         .then(response => {
    //             if (response.data.resultCode === 0) {
    //                 dispatch(setAuthUserData(null, null, null, false));
    //             }
    //         });
    // }
    dispatch(setAuthUserData(null, null, null,  null, false));
}

