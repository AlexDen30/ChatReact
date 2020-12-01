import React, { useRef, useState } from 'react';
import Fab from '@material-ui/core/Fab';
import SendIcon from '@material-ui/icons/Send';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import { Create, Publish } from '@material-ui/icons';
import { Divider } from 'material-ui';
import { connect } from 'react-redux';
import { sendMessageThunkCreator, uploadThunkCreator } from '../../redux/messages-reducer';

const useStyles = makeStyles((theme) => ({



}));

function InputText(props) {

    const classes = useStyles();

    const [input, setInput] = useState("");
    const [blockInput, setBlockInput] = useState(true);
    const [file, setFile] = useState(null);

    const handleInputChange = (e) => {
        const value = e.target.value;

        value === "" ? setBlockInput(true) : setBlockInput(false);
        setInput(value);
    }

    const handleSendTextMessage = () => {
        let date = new Date();
        let stringToSend = date.getHours() + ':' + date.getMinutes() + ' - ' + date.getDay() + '.' + date.getMonth() + '.' + date.getFullYear();
        props.sendMessage(input, stringToSend, props.userName);
        setInput("");
    }

    const handleSendFileMessage = () => {
        //debugger;
        let date = new Date();
        let stringToSend = date.getHours() + ':' + date.getMinutes() + ' - ' + date.getDay() + '.' + date.getMonth() + '.' + date.getFullYear();
        props.sendFile(file, stringToSend, props.userName);
        setInput("");
        setFile(null);
    }

    const hiddenFileInput = useRef(null);

    const uploadClick = (e) => {
        hiddenFileInput.current.click();
    }

    const handleUploadChange = (e) => {
        setFile(e.target.files[0]);
        setInput(e.target.files[0].name + " (double click here to undo)");
        e.target.value = null;
    }

    const handleUndoUpload = () => {
        setFile(null);
        setInput("");
    }

    return (
        <div>
            <Grid container style={{ padding: '20px' }}>
                <Grid xs={1} align="right">
                    <Fab  color="primary" aria-label="publish" onClick={uploadClick}><Publish /></Fab>
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
                        disabled={file ? true : false}
                        onDoubleClick={file ? handleUndoUpload : ()=>{}}
                        onChange={handleInputChange}
                    />
                </Grid>
                <Grid xs={1} align="right">
                    
                </Grid>
                <Grid xs={1} align="right">
                    <Fab 
                        disabled={input==="" ? true : false} 
                        color="primary" aria-label="add" 
                        onClick={file ? handleSendFileMessage : handleSendTextMessage}>
                            <Create />
                    </Fab>
                </Grid>
            </Grid>
            <input 
                type="file"
                ref={hiddenFileInput}
                onChange={handleUploadChange} 
                style={{display:'none'}} 
            />
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
        },
        sendFile: (msgContent, sendTime, sender) => {
            dispatch(uploadThunkCreator(msgContent, sendTime, sender));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(InputText);