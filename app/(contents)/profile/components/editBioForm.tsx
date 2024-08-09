import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export function BioForm(props: any) {
  return (
    <>
      <DialogTitle sx={{fontWeight: "400"}}>Enter your new bio</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Character limit: 100
        </DialogContentText>
        <TextField
          autoFocus
          required
          margin="dense"
          id="bio"
          name="bio"
          label="New Bio"
          type="text"
          fullWidth
          variant="standard"
          inputProps={{ maxLength: 100 }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => {props.closeFunction()}}>Cancel</Button>
        <Button type="submit">CONFIRM</Button>
      </DialogActions>
    </>
  )
}
