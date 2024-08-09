import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

const isValidUrl = (urlString:any)=> {
  var urlPattern = new RegExp('^(https?:\\/\\/)?'+ // validate protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // validate domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))'+ // validate OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // validate port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?'+ // validate query string
    '(\\#[-a-z\\d_]*)?$','i'); // validate fragment locator
  return !!urlPattern.test(urlString);
}

export function ChangePFPDialog(props: any) {
  const [imageURL, setImageURL] = React.useState("");

  return (
    <>
      <DialogTitle sx={{fontWeight: "400"}}>Set new profile picture</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          required
          margin="dense"
          id="imageURL"
          name="image"
          label="Enter image URL"
          type="text"
          fullWidth
          variant="standard"
          onChange={(e) => {setImageURL(e.target.value)}}
        />
      </DialogContent>
      <div style={{width: "530px"}}>
        {
          isValidUrl(imageURL)
          ? (<img src={imageURL} alt="" style={{
              width: "500px",
              height: "500px",
              borderRadius: "50%",
              margin: "15px",
              border: "1px solid lightgrey",
              objectFit: "cover"
            }}
            />)
          : ""
        }
      </div>
      <DialogActions>
        <Button onClick={() => {props.setChangePFPDialog(false)}}>Cancel</Button>
        <Button type="submit">CONFIRM</Button>
      </DialogActions>
    </>
  )
}
