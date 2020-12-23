import React, { useRef, useState } from 'react';
import Fab from '@material-ui/core/Fab';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import { Create, Publish } from '@material-ui/icons';
import { connect } from 'react-redux';
import { sendMessageThunkCreator} from '../../redux/messages-reducer';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import {ChromePicker} from 'react-color';



function InputText(props) {


    const [input, setInput] = useState("");
    const [blockInput, setBlockInput] = useState(true);
    const [file, setFile] = useState(null);
    const [msgColor, setMsgColor] = useState('#20F980');
    const [isOpenColorDialog, setOpenColorDialog] = useState(false);


    const handleClickOpenColorDialog = () => {
        setOpenColorDialog(true);
      };
    
      const handleCloseColorDialog = () => {
        setOpenColorDialog(false);
      };

    const handleInputChange = (e) => {
        const value = e.target.value;

        value === "" ? setBlockInput(true) : setBlockInput(false);
        setInput(value);
    }

    const handleSendMessage = () => {
        let date = new Date();
        let dateStringToSend = date.getDate() + '.' + (date.getMonth()+1) + '.' + date.getFullYear() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
        file 
            ? props.sendMessage(props.currentChannelId, "file", input.slice(0, input.indexOf('(double click here to undo)') - 1), 
                                file, msgColor.slice(1), dateStringToSend) 
            : props.sendMessage(props.currentChannelId, "text", input, " ", msgColor.slice(1), dateStringToSend);
        
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
                        color="primary" 
                        aria-label="add" 
                        onClick={handleSendMessage}
                        onContextMenu={handleClickOpenColorDialog}
                    >
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

            <Dialog
                open={isOpenColorDialog}
                onClose={handleCloseColorDialog}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"Set message color:"}</DialogTitle>
                <DialogContent>
                    <ChromePicker 
                        color={msgColor} 
                        onChange={updatedColor => setMsgColor(updatedColor.hex)}
                    />
                </DialogContent>
                <DialogActions>
                <Button onClick={handleCloseColorDialog} color="primary">
                    Close
                </Button>
                <Button onClick={handleCloseColorDialog} color="primary" autoFocus>
                    Ok
                </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}


const mapStateToProps = (state) => {
    return {
        currentChannelId: state.channelsList.selectedChannelId,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        sendMessage: (channelId, type, contentText, contentFile, color, creationTime) => {
            dispatch(sendMessageThunkCreator(channelId, type, contentText, contentFile, color, creationTime));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(InputText);