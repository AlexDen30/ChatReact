import React, { useState } from 'react';
import Fab from '@material-ui/core/Fab';
import SendIcon from '@material-ui/icons/Send';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import { Create, Publish } from '@material-ui/icons';
import { Divider } from 'material-ui';
import { connect } from 'react-redux';
import { sendMessageThunkCreator } from '../../redux/messages-reducer';

const useStyles = makeStyles((theme) => ({



}));

function InputText(props) {

    const classes = useStyles();

    const [input, setInput] = useState("");

    const handleInputChange = (e) => {
        const value = e.target.value;
        setInput(value);
    }

    const handleSendMessage = () => {
        let date = new Date();
        let stringToSend = date.getHours() + ':' + date.getMinutes() + ' - ' + date.getDay() + '.' + date.getMonth() + '.' + date.getFullYear();
        props.sendMessage(input, stringToSend, props.userName);
        setInput("");
    }

    return (
        <div>
            <Grid container style={{ padding: '20px' }}>
                <Grid xs={1} align="right">
                    <Fab  color="primary" aria-label="publish"><Publish /></Fab>
                </Grid>
                <Grid xs={1} align="right">
                    
                </Grid>
                <Grid item xs={8}>
                    <TextField 
                        autoComplete="off" 
                        id="outlined-basic-message" 
                        label="Type Something" 
                        fullWidth 
                        value = {input}
                        onChange={handleInputChange}
                    />
                </Grid>
                <Grid xs={1} align="right">
                    
                </Grid>
                <Grid xs={1} align="right">
                    <Fab disabled={input==="" ? true : false} color="primary" aria-label="add" onClick={handleSendMessage}><Create /></Fab>
                </Grid>
            </Grid>
        </div>
    )
}


const mapStateToProps = (state) => {
    return {
        userName: state.authorizationData.userName
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        sendMessage: (msgContent, sendTime, sender) => {
            dispatch(sendMessageThunkCreator(msgContent, sendTime, sender));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(InputText);