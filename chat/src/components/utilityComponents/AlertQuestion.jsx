import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import { NavLink } from 'react-router-dom';

const AlertQuestion = (props) => { // open, handleClose, title, linkTo
  return (
    <Dialog
      open={props.open}
      onClose={props.handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{props.title}</DialogTitle>
      <DialogActions>
        {
          props.linkTo
            ?
              <Button 
                component={NavLink}
                to={props.linkTo}
                onClick={() => props.handleClose(true)} 
                color="primary"
              >
                Yes
              </Button>
            :
            <Button
                onClick={() => props.handleClose(true)} 
                color="primary"
              >
                Yes
              </Button>
        }
        
        <Button onClick={() => props.handleClose(false)} color="primary" >
          No
        </Button>
      </DialogActions>
    </Dialog>
  );
}


export default AlertQuestion;