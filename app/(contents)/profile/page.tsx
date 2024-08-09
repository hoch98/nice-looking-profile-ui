"use client"

import * as React from 'react';
import { Avatar, Skeleton } from '@mui/joy';
import { Suspense } from 'react';
import Button from '@mui/joy/Button';
import AspectRatio from '@mui/joy/AspectRatio';
import Box from '@mui/joy/Box';
import IconButton from '@mui/joy/IconButton';
import Stack from '@mui/joy/Stack';
import Card from '@mui/joy/Card';
import Grid from '@mui/material/Grid';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded'
import UploadRoundedIcon from '@mui/icons-material/UploadRounded'
import Dialog from '@mui/material/Dialog';
import { BioForm } from './components/editBioForm';
import { Unstable_Popup as BasePopup } from '@mui/base/Unstable_Popup';
import {Sketch} from '@uiw/react-color';
import Alert from '@mui/material/Alert';
import Collapse from '@mui/material/Collapse';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { FollowDialog } from './components/followDialog';
import { ExpandedImage } from './components/imageExpanded';
import { CommentSectionDialog } from './components/commentSectionDialog';
import {CreatePostDialog} from './components/createPostDialog';
import Paper, { PaperProps } from '@mui/material/Paper';
import Draggable from 'react-draggable';
import { ChangePFPDialog } from './components/changePFPDialog';

function PaperComponent(props: PaperProps) { 
  // PaperProps is an import from '@material-ui/core'
  return (
      <Paper {...props} style={{ margin: 0, maxHeight: '100%' }} />
  );
}

export default function Page() {

  const [data, setData] = React.useState<any>(undefined);
  const [followers, setFollowers] = React.useState<any>(undefined);
  const [following, setFollowing] = React.useState<any>(undefined);
  const [posts, setPosts] = React.useState<any>(undefined);
  const [saved, setSaved] = React.useState<any>(undefined);
  const [tab, setTab] = React.useState(0);
  const [bio, setBio] = React.useState<any>(undefined);
  const [hex, setHex] = React.useState("aaaaaaaa");
  const [profilePicture, setProfilePicture] = React.useState<any>(undefined);
  const [followPopupType, setFollowPopupType] = React.useState(0);
  const [saveAlert, openSaveAlert] = React.useState(false);
  const [anchor, setAnchor] = React.useState<null | HTMLElement>(null);
  const [openImage, setOpenImage] = React.useState(-1);
  const [openImageDialog, setOpenImageDialog] = React.useState(false);
  const [openComment, setOpenComment] = React.useState(false);
  const [dialogOpen, setOpen] = React.useState(false);
  const [followPopup, openFollowPopup] = React.useState(false);
  const [createPostDialog, setCreatePostDialog] = React.useState(false);
  const [changePFPDialog, setChangePFPDialog] = React.useState(false);

  const fetchData = () => {
    fetch("sampleData/profile.json").then(resp => resp.json()).then(dat => {
      setData(dat);
      setHex(dat.profile.bannerColor);
      setBio(dat.profile.bio);
      setProfilePicture(dat.profile.image);
    });
  };

  const fetchFollowers = () => {
    fetch("sampleData/followers.json").then(resp => resp.json()).then(dat => {setFollowers(dat)});
  }

  const fetchFollowing = () => {
    fetch("sampleData/following.json").then(resp => resp.json()).then(dat => {setFollowing(dat)});
  }

  const fetchPosts = () => {
    fetch("sampleData/posts.json").then(resp => resp.json()).then(dat => {
      setPosts(dat); 
    });
  }

  const fetchSaved = () => {
    fetch("sampleData/savedPosts.json").then(resp => resp.json()).then(dat => {
      console.log(dat)
      setSaved(dat);
    });
  }

  React.useEffect(() => {
    fetchData();
    fetchFollowers();
    fetchFollowing();
    fetchPosts();
    fetchSaved();
  }, []);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchor(anchor ? null : event.currentTarget);
  };

  const open = Boolean(anchor);
  const id = open ? 'simple-popup' : undefined;

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleFollowPopupOpen = () => {
    openFollowPopup(true);
  };
  const handleFollowPopupClose = () => {
    openFollowPopup(false);
  };

  return (
    <>
      <Collapse in={saveAlert} sx={{display: { xs: 'none', sm: 'flex' }}}>
        <Alert
          severity="warning"
          action={
            <Button variant="solid" color='primary'>
              Save
            </Button>
          }
          sx={{ mb: 2 }}
        >
          You have unsaved changes! Click here to save!
        </Alert>
      </Collapse>
      <Card sx={{display: { xs: 'none', sm: 'flex' }, margin:0, padding: 0, overflow:"hidden", borderRadius:"15px", maxHeight: 1000}}>
      {
        data != undefined
        ? <Box sx={{display: { xs: 'none', sm: 'flex' }, height: "75px", backgroundColor:hex, alignItems:"center", justifyContent: "right", overflow:"hidden"}}>
          <IconButton
            aria-label="choose banner colour"
            size="sm"
            variant="outlined"
            color="neutral"
            aria-describedby={id} 
            onClick={handleClick}
            sx={{
              display:(data != undefined ? "inherit" : "none"),
              bgcolor: 'background.body',
              width: 30,
              height: 30,
              zIndex: 2,
              marginRight: 2,
              borderRadius: '50%',
              boxShadow: 'sm',
            }}
          >
            <EditRoundedIcon />
          </IconButton>
          <BasePopup id={id} open={open} anchor={anchor}>
            <Sketch
              style={{ marginLeft: 20 }}
              color={hex}
              onChange={(color:any) => {
                openSaveAlert(true);
                setHex(color.hex);
              }}
            />
          </BasePopup>
          <Skeleton variant='overlay' sx={{height: "75px"}} loading={data == undefined}/>
        </Box>
        : <Box sx={{height: "75px"}}>
          <Skeleton variant='overlay' sx={{height: "75px"}}></Skeleton>
        </Box>
      }
        <Stack
          direction="row"
          spacing={3}
          sx={{ display: { xs: 'none', sm: 'flex' }, my: 1, margin: "25px"}}
        >
          <Stack direction="column" spacing={1}>
            <AspectRatio
              ratio="1"
              maxHeight={200}
              sx={{ flex: 1, minWidth: 120, borderRadius: '50%', border: "1px solid lightgrey" }}
            >
              {
                data != undefined
                ? <img
                    src={profilePicture}
                  />
                : <Avatar/>
              }
            </AspectRatio>
            <a onClick={() => {setChangePFPDialog(true)}} style={{cursor: "pointer", color:"#0075FF", textAlign: 'center', display:(data != undefined ? "initial" : "none")}}>Change picture</a>
            <Dialog
              open={changePFPDialog}
              onClose={() => setChangePFPDialog(false)}
              PaperProps={{
                component: 'form',
                onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
                  event.preventDefault();
                  const formData = new FormData(event.currentTarget);
                  const formJson = Object.fromEntries((formData as any).entries());
                  var imageURL = formJson.image;
                  
                  setProfilePicture(imageURL);
                  setChangePFPDialog(false);
                  openSaveAlert(true);
                },
              }}
            >
              <ChangePFPDialog setChangePFPDialog={setChangePFPDialog}/>
            </Dialog>
          </Stack>
          <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={0}>
              <Grid item xs={6}>
                <Suspense >
                  {
                    data != undefined ?
                    <h1 style={{fontSize: "25px", fontWeight: "bold"}}>{data.displayname} <span style={{fontSize: "15px", fontWeight: "normal"}}>/ @{data.handle}</span></h1>
                    :
                    <Skeleton variant="text" level="h1"/>
                  }
                </Suspense>
                <br />
                {
                    data != undefined ?
                    <p id='bioText' style={{
                      overflow:"hidden",
                      display:"-webkit-box",
                      WebkitBoxOrient:"vertical",
                      WebkitLineClamp:2
                    }}>{bio} </p>
                    :
                    <Skeleton variant="text" level="h2"/>
                  }
                <a onClick={() => {handleClickOpen()}} style={{cursor: "pointer", color:"#0075FF",  display:(data != undefined ? "initial" : "none")}}>Edit</a>
                <Dialog
                  open={dialogOpen}
                  onClose={handleClose}
                  fullWidth
                  PaperProps={{
                    component: 'form',
                    onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
                      event.preventDefault();
                      const formData = new FormData(event.currentTarget);
                      const formJson = Object.fromEntries((formData as any).entries());
                      const bio = formJson.bio;
                      setBio(bio);
                      openSaveAlert(true);
                      handleClose();
                    },
                  }}
                >
                  <BioForm key="bioForm" closeFunction={handleClose}/>
                </Dialog>
              </Grid>
              <Grid item xs={2}>
                <h1 style={{fontSize: "25px", textAlign:"center", fontWeight:"bold"}}>
                {data != undefined 
                  ? <>
                    {data.posts.length}
                    <br />
                    <span style={{fontSize: "15px",  fontWeight: "normal"}}>Posts</span>
                  </>  
                  : <Skeleton variant='text' level='h1'/>
                  } 
                </h1>
              </Grid>
              <Grid item xs={2}>
                <h1 style={{cursor: "pointer", fontSize: "25px", textAlign:"center", fontWeight:"bold"}} onClick={() => {setFollowPopupType(1);handleFollowPopupOpen()}}>
                  {followers != undefined  && data != undefined
                  ? <>
                    {followers.length}
                    <br />
                    <span style={{fontSize: "15px",  fontWeight: "normal"}}>Followers</span>
                  </>  
                  : <Skeleton variant='text' level='h1'/>
                  } 
                </h1>
              </Grid>
              <Grid item xs={2} sx={{marginRight:"5"}}>
                <h1 style={{cursor: "pointer", fontSize: "25px", textAlign:"center", fontWeight:"bold"}} onClick={() => {setFollowPopupType(0);handleFollowPopupOpen()}}>
                  {following != undefined && data != undefined
                  ? <>
                    {following.length}
                    <br />
                    <span style={{fontSize: "15px",  fontWeight: "normal"}}>Following</span>
                  </>  
                  : <Skeleton variant='text' level='h1'/>
                  } 
                </h1>
              </Grid>
            </Grid>
            <Dialog
              open={followPopup}
              onClose={handleFollowPopupClose}
            >
              {
                followers != undefined && following != undefined
                ? <FollowDialog followers={followers} following={following} type={followPopupType} fetchFollowers={fetchFollowers} fetchFollowing={fetchFollowing}/>
                : <Skeleton variant='overlay'/>
              }
            </Dialog>
          </Box>
        </Stack>
        <Box sx={{flexGrow:1, display: { xs: 'none', sm: 'flex'}}}  >
          <Grid container spacing={0} sx={{textAlign:"center"}}>
            <Grid onClick={() => {setTab(0)}} item xs={6} sx={{cursor: "pointer", borderTop:( tab == 0 ? "2px solid orange" : "1px solid grey")}}>
                <div style={{marginTop:5}}>
                  <UploadRoundedIcon sx={{width: "35px", height: "35px", color:(tab==0?"orange":"grey"), display: "inline-block"}}/>
                  <h1 style={{display: "inline-block", fontWeight:"bold", color:(tab==0?"orange":"grey")}}>Posts</h1>
                </div>
            </Grid>
            <Grid onClick={() => {setTab(1)}} item xs={6} sx={{cursor: "pointer", borderTop:( tab == 1 ? "2px solid orange" : "1px solid grey"), display: "visible"}}>
                <div style={{marginTop:5}}>
                  <AddRoundedIcon sx={{width: "35px", height: "35px", color:(tab==1?"orange":"grey"), display: "inline-block"}} />
                  <h1 style={{display: "inline-block", fontWeight:"bold", color:(tab==1?"orange":"grey")}}>Saved</h1>
                </div>
              </Grid>
            </Grid>
        </Box>
        <Box sx={{flexGrow:1, margin: 0, display: { xs: 'none', sm: 'flex'}, maxHeight:500, overflow:"auto"}}>
            <Grid container spacing={0}>
              {
                tab == 0
                ? <Grid key={"post0"} sx={{aspectRatio:"1/1"}} item xs={3}>
                    <div style={{border:"1px solid grey", width: "calc(100% - 10px)", height: "calc(100% - 10px)", margin:"5px", borderRadius:"15px",  overflow:"hidden"}}>
                      <IconButton onClick={() => {setCreatePostDialog(true)}} sx={{width:"100%", height: "100%"}}>
                        <AddRoundedIcon sx={{width:"100%", height: "100%"}}/>
                      </IconButton>
                    </div>
                    <Dialog
                      open={createPostDialog}
                      onClose={() => setCreatePostDialog(false)}
                      PaperProps={{
                        component: 'form',
                        onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
                          event.preventDefault();
                          const formData = new FormData(event.currentTarget);
                          const formJson = Object.fromEntries((formData as any).entries());
                          var caption = formJson.caption;
                          var imageURL = formJson.image;
                          
                          setCreatePostDialog(false);
                        },
                      }}
                    >
                      <CreatePostDialog setCreateImageDialog={setCreatePostDialog}/>
                    </Dialog>
                  </Grid>
                : ""
              }
              {
                posts == undefined
                ? ""
                : (
                  tab == 0
                  ? <PostImageSource setOpenImageDialog={setOpenImageDialog} setOpenImage={setOpenImage} setOpenComment={setOpenComment} data={posts}/>
                  : <PostImageSource setOpenImageDialog={setOpenImageDialog} setOpenImage={setOpenImage} setOpenComment={setOpenComment} data={saved}/>
                )
              }
              <Draggable handle='#imageDialogDragHandle'>
                <Dialog
                  open={openImageDialog}
                  disableEnforceFocus // Allows other things to take focus
                  hideBackdrop  // Hides the shaded backdrop
                  onClose={(event, reason) => {
                    if(reason !== 'backdropClick' && reason !== 'escapeKeyDown') {
                        setOpen(false);
                        setOpenImageDialog(false);
                    }
                  }}
                  PaperComponent={PaperComponent}
                  sx={{
                    '.css-6p0l3n-MuiTypography-root-MuiDialogTitle-root': {
                      paddingTop: "10px",
                    },
                    top: "10%",
                    left: "30%",
                    height:"fit-content",
                    width:"fit-content",
                  }}
                >
                  {
                    posts != undefined && data != undefined && following != undefined
                    ? 
                    ( tab == 0
                      ? <ExpandedImage following={following} postId={openImage} posts={posts} setPosts={setPosts} uid={data.profile.userId} setOpenImageDialog={setOpenImageDialog} setOpenImage={setOpenImage} openComment={openComment} setOpenComment={setOpenComment} fetchFollowing={fetchFollowing}/>
                      : <ExpandedImage following={following} postId={openImage} posts={saved} setPosts={setSaved} uid={data.profile.userId} setOpenImageDialog={setOpenImageDialog} setOpenImage={setOpenImage} openComment={openComment} setOpenComment={setOpenComment} fetchFollowing={fetchFollowing}/>
                    )
                    : <Skeleton variant='overlay'/>
                  }
                </Dialog>
              </Draggable>
              <Draggable handle='#imageDialogDragHandle'>
                <Dialog
                  open={openComment}
                  disableEnforceFocus // Allows other things to take focus
                  hideBackdrop  // Hides the shaded backdrop
                  onClose={(event, reason) => {
                      if(reason !== 'backdropClick' && reason !== 'escapeKeyDown') {
                          setOpenComment(false);
                      }
                  }}
                  PaperComponent={PaperComponent}
                  sx={{
                    '.css-6p0l3n-MuiTypography-root-MuiDialogTitle-root': {
                      paddingTop: "5px",
                      paddingRight: "0px"
                    },
                    top: "20%",
                    left: "70%",
                    height:"fit-content",
                    width:"fit-content",
                  }}
                >
                  {
                    posts != undefined && data != undefined
                    ? ( tab == 0
                      ? <CommentSectionDialog postId={openImage} fetchPosts={fetchPosts} posts={posts} setPosts={setPosts} uid={data.id} setOpenComment={setOpenComment}/>
                      : <CommentSectionDialog postId={openImage} fetchPosts={fetchSaved} posts={saved} setPosts={setSaved} uid={data.id} setOpenComment={setOpenComment}/>
                    )
                    : <Skeleton variant='overlay'/>
                  }
                </Dialog>
              </Draggable>
            </Grid>
        </Box>
      </Card>
    </>
  )
}

function PostImageSource(props:any) {
  var data = props.data
  if (data != undefined) {
    return <>
      {
        data.map((post:any) => {
          return <Grid key={"post"+post.id} sx={{aspectRatio:"1/1"}} item xs={3} onClick={() => {props.setOpenImage(post.id); props.setOpenImageDialog(true); props.setOpenComment(false); }}>
                  <div style={{border:"1px solid grey" , width: "calc(100% - 10px)", height: "calc(100% - 10px)", margin:"5px", borderRadius:"15px",  overflow:"hidden", cursor: "pointer"}}>
                    <img style={{objectFit: "cover", width: "100%", height: "100%"}} src={
                      post.images[0].url
                    } alt="" />
                  </div>
                </Grid>
        })
      }
    </>
  }
}