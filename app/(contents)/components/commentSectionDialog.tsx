import * as React from 'react'
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/joy/Button';
import Avatar from '@mui/material/Avatar';
import Grid from '@mui/material/Grid';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import Favorite from '@mui/icons-material/Favorite';
import IconButton from '@mui/joy/IconButton';
import Close from '@mui/icons-material/Close';
import Box from '@mui/joy/Box';
import DragHandleIcon from '@mui/icons-material/DragHandle';
import Input from "@mui/joy/Input"

function rid() {
  return "100000000000".replace(/[018]/g, c =>
    (+c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> +c / 4).toString(16)
  );
}

function updateProp(comments:any, commentId:any, uid:any, posts:any, setPosts:any) {

  var i = -1;
  var i2 = -1;
  comments.forEach((comment:any, j:number) => {
    if (comment.id == commentId) {
      i = j;
      if (comment.likes.map((obj:any, k:any) => {i2=k; return obj.userId}).includes(uid)) {
        ;
      } else {
        comment.likes.push({
          id: rid(),
          commentId: commentId,
          userId: uid
        })
      }
    }
  })

  if (i != -1 && i2 != -1) {
    comments[i].likes.splice(i2, 1);
  }

  posts.forEach((post:any) => {
    if (post.comments.id == comments.id) {
      posts.comments = comments
    }
  });

  setPosts(posts);
}

function updateState( comments:any, setLikedComments:any, uid: any) {
  setLikedComments(comments.map((comment:any) => {
    return comment.likes.map((obj:any) => {return obj.userId}).includes(uid)
  }));
}

export function CommentSectionDialog(props: any) {
  const [tab, setTab] = React.useState(false);
  const [commentInput, setCommentInput] = React.useState("");

  if (props.postId === -1) {
    return <></>;
  }

  var uid = props.uid
  var posts = props.posts
  var post = posts.filter((post:any) => {return post.id == props.postId})[0]

  var comments = post.comments;

  const [likedComments, setLikedComments] = React.useState(comments.map((comment:any) => {
    return comment.likes.map((obj:any) => {return obj.userId}).includes(uid)
  }));

  React.useEffect(() => {
    updateState(comments, setLikedComments, uid);
  }, []);

  return (
    <>
    <DialogTitle sx={{fontWeight:"bolder", marginRight: "10px", display: { xs: 'none', sm: 'block' }}}>
      <Box id="draggable-dialog-title" sx={{height:"35px",alignItems:"center", justifyContent: "right", marginBottom:"10px"}}>
        <IconButton
          size="sm"
          variant="plain"
          color="neutral"
          id='imageDialogDragHandle'
          sx={{
            bgcolor: 'background.body',
            width: 30,
            height: 30,
            zIndex: 2,
            float: "left",
          }}
        >
          <DragHandleIcon />
        </IconButton>
        <IconButton
          size="sm"
          variant="outlined"
          color="neutral"
          onClick={() => {props.setOpenComment(false)}}
          sx={{
            bgcolor: 'background.body',
            width: 30,
            height: 30,
            zIndex: 2,
            borderRadius: '50%',
            boxShadow: 'sm',
            float: "right",
          }}
        >
          <Close />
        </IconButton>
      </Box>
      <Grid container spacing={0} sx={{width:"350px"}}>
          <Grid item xs={6} sx={{borderTop:(!tab ? "black solid" : "lightgrey solid"), textAlign:"center"}} onClick={() => {setTab(!tab)}}>
            <h1 style={{color:(!tab ? "black":"lightgrey")}}>Reactions</h1>
          </Grid>
          <Grid item xs={6} sx={{borderTop:(tab ? "black solid" : "lightgrey solid"), textAlign:"center"}} onClick={() => {setTab(!tab)}}>
            <h1 style={{color:(tab ? "black":"lightgrey")}}>Comments</h1>
          </Grid>
      </Grid>
      <br />
      <div style={{maxHeight:"400px", overflow:"scroll"}}>
        { 
          tab ?
          comments.map((comment:any, i:number) => {
            return (
              <>
              <Grid key={"comment:"+props.postId+":"+i} container columnGap={2} sx={{alignItems:"center", justifyContent: "left"}}>
                <Grid item xs={1} sx={{float: "left"}}>
                  <Avatar/>
                </Grid>
                <Grid item xs={8} sx={{float:"left"}}>
                  <h1 style={{
                    fontWeight:"bold", 
                    fontSize:"15px",
                    overflow:"hidden",
                    display:"-webkit-box",
                    WebkitBoxOrient:"vertical",
                    WebkitLineClamp:2
                  }}>
                    {comment.author.displayname}
                    &nbsp;
                    <span style={{fontWeight:"normal"}}>{comment.content}</span>
                  </h1>
                </Grid>
                {
                  likedComments[i] ?
                  <Favorite sx={{float: "right", justifyContent:"center", color:"red"}} onClick={() => {
                    setLikedComments(
                      likedComments.map((like:any, index:any) => {
                        if (index == i) {
                          return false
                        }
                        return like
                      })
                    );
                    updateProp(comments, comment.id, uid, posts, props.setPosts);
                  }}/>
                  :
                  <FavoriteBorderOutlinedIcon sx={{float: "right", justifyContent:"center"}} onClick={() => {
                    setLikedComments(
                      likedComments.map((like:any, index:any) => {
                        if (index == i) {
                          return true
                        }
                        return like
                      })
                    );
                    updateProp(comments, comment.id, uid, posts, props.setPosts);
                  }}/>
                }
                <br />
                <br />
              </Grid>
              </>
            )
          })
          :
          ""
        }
      </div>
      {
        tab ?
        <form onSubmit={(event) => {
          event.preventDefault();
          if (commentInput.replaceAll(" ","") == "") {
            alert("Cannot enter empty comment");
          } else {
            setCommentInput("");
          }
        }}>
          <Grid container columnGap={0}>
            <Grid item xs={10}>
              <Input slotProps={{ input: { maxLength: 50 } }} value={commentInput} onChange={(event) => {setCommentInput(event.target.value)}} sx={{borderTopRightRadius: 0, borderBottomRightRadius: 0, fontWeight:"normal"}}/>
            </Grid>
            <Grid item xs={2}>
              <Button type="submit" sx={{borderTopLeftRadius: 0, borderBottomLeftRadius: 0}}
              onClick={() => {

              }}
              >Post</Button>
            </Grid>
          </Grid>
        </form>
        :
        ""
      }
    </DialogTitle>
    </>
  )
}