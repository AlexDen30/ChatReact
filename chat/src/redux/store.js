import {createStore} from 'redux';
import thunkMiddleware from 'redux-thunk';
import {combineReducers} from 'redux';
import {applyMiddleware, compose} from 'redux';
import {channelsPanelReducer} from './channelsPanel-reducer';
import {authorizationReducer} from './authorization-reducer';
import { messagesReducer } from './messages-reducer';




let reducers = combineReducers({
    channelsList: channelsPanelReducer,
    authorizationData: authorizationReducer,
    messagesData: messagesReducer
});

export let store = createStore(reducers, 
    compose(applyMiddleware(thunkMiddleware)))//, 
    //window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__() ));




