//import { authAPI } from "../api/api";
//import { stopSubmit } from 'redux-form';

import { authAPI } from "../api/api";

const SET_USER_DATA = 'SET_USER_DATA'
const TOOGLE_IS_FETCHING = 'TOOGLE_IS_FETCHING';

let initialState = {
    userName: null,
    firstName: null,
    lastName: null,
    birthDate: null,
    email: null,
    isAuthorized: false,
    role: null
}


export const isFetchingAC = (isFetching) => {
    return {
        type: TOOGLE_IS_FETCHING,
        isFetching,
    }
}

const setAuthUserDataAC = (userName, email, role, firstName, secondName, birthDate, isAuthorized) => {
    return {
        type: SET_USER_DATA,
        payload: {
            userName,
            email,
            role,
            firstName,
            secondName,
            birthDate,
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

    
    return authAPI.me()
        .then(data => {
            if (data.statusText === 'OK') {
                dispatch(setAuthUserDataAC(data.data.userName, data.data.email, data.data.role, 
                    data.data.firstName, data.data.secondName, data.data.birthDate, true));
            }
        });
   //return dispatch(setAuthUserData('data.id', 'current',' data.email', 'data.login', true));
}

// export const setAuthGuestDataThunkCreator = () => (dispatch) => {

//     return dispatch(setAuthUserData('guest', 'current','----', 'guest', true));
// }

export const loginThunkCreator = (email, password) => (dispatch) => {

    authAPI.login(email, password)
        .then(response => {
            
            if (response.statusText === 'OK') {
                dispatch(setAuthUserDataThunkCreator());
            } else {
                alert("Wrong email or password!");
            }
        });
    // if (email === 'guest' && password === 'guest') {
    //     dispatch(setAuthGuestDataThunkCreator());
    // } else {
    //     dispatch(setAuthUserDataThunkCreator());
    // }

}


export const logoutThunkCreator = () => (dispatch) => {
    
    authAPI.logout()
        .then(response => {
            if (response.statusText === 'OK') {
                dispatch(setAuthUserDataAC(null, null, null, null, null, null, false));
            }
        });
    
}

export const signupThunkCreator = (userName, email, firstName, secondName, birthDate, password) => {
   
    authAPI.signup(userName, email, firstName, secondName, birthDate, password)
        .then(response => {
            if (response.statusText === 'OK') {
                alert("Account created! Now you can signin");
            } else {
                alert("Invalid data");
            }
        });

}