import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import PersonIcon from '@mui/icons-material/Person';
import { blue } from '@mui/material/colors';
import CloseIcon from '@mui/icons-material/Close';
import DialogTitle from '@mui/material/DialogTitle';
import Input from '@mui/joy/Input';
import IconButton from '@mui/joy/IconButton';

export function FollowDialog(props: any) {
  const [searchParam, changeSearchParam] = React.useState("")
  var type = props.type

  return (
    <>
      <DialogTitle sx={{fontWeight: "400", display: { xs: 'none', sm: 'block' }}}>
        {type== 0 ? "Following" : "Followers"}
        <Input 
          placeholder="Search" 
          variant="soft" 
          onChange={(event) => changeSearchParam(event.target.value)} 
          slotProps={{ input: { maxLength: 20} }} sx={{
            width:"90%",
            margin: "5%"
          }}
        />
      </DialogTitle>
      <List sx={{ pt: 0, overflow:"scroll", maxHeight:"400px", display: { xs: 'none', sm: 'block' }}}>
        <ListItems type={type} data={type == 0 ? props.following : props.followers} searchParam={searchParam} fetchFunction={type == 0 ? props.fetchFollowing : props.fetchFollowers}/>
      </List>
    </>
  )
}


function ListItems(props:any) {
  var data = props.data

  if (data != undefined) {
    return data.filter((element:any) => {return element.displayname.toLowerCase().includes(props.searchParam.toLowerCase())}).map((us:any)=>{
      return <ListItem disableGutters key={us.handle}>
         <ListItemButton>
           <ListItemAvatar>
             <Avatar sx={{ bgcolor: blue[100], color: blue[600] }}>
               <PersonIcon />
             </Avatar>
           </ListItemAvatar>
           <ListItemText primary={us.displayname} />
         </ListItemButton>
         <IconButton
           aria-label="choose banner colour"
           size="sm"
           variant="soft"
           color="neutral"
           sx={{
             bgcolor: 'background.body',
             width: 30,
             height: 30,
             zIndex: 2,
             borderRadius: "50%",
             marginRight: "15px",
           }}
         >
           <CloseIcon />
         </IconButton>
       </ListItem>
   })
  } else {
    return "";
  }
}