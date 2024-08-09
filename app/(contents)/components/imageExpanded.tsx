import * as React from 'react'
import DialogTitle from '@mui/material/DialogTitle';
import Carousel from 'react-material-ui-carousel'
import { Button } from '@mui/joy';
import Avatar from '@mui/material/Avatar';
import Grid from '@mui/material/Grid';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import FavoriteIcon from '@mui/icons-material/Favorite';
import MapsUgcRoundedIcon from '@mui/icons-material/MapsUgcRounded';
import BookmarkBorderOutlinedIcon from '@mui/icons-material/BookmarkBorderOutlined';
import IconButton from '@mui/joy/IconButton';
import Close from '@mui/icons-material/Close';
import Box from '@mui/joy/Box';
import DragHandleIcon from '@mui/icons-material/DragHandle';

function rid() {
  return "100000000000".replace(/[018]/g, c =>
    (+c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> +c / 4).toString(16)
  );
}

function updateProps(postId: string, posts:any, setPosts:Function, uid:any, setPostLiked:Function) {
  var i = -1;
  var i2 = -1;
  posts.forEach((post:any, j:number) => {
    if (post.id == postId) {
      i = j;
      post.likes.forEach((like:any, k:number) => {
        if (like.userId == uid) {
          i2 = k;
        }
      })
    }
  })

  if (i != -1 && i2 != -1) {
    posts[i].likes.splice(i2, 1);
  } if (i != -1 && i2 == -1) {
    posts[i].likes.push({
      id: rid(),
      postId: postId,
      userId: uid
    });
  }

  setPosts(posts);
  var postIndex = -1;
  var post = posts.filter((post:any, i:any) => {if (post.id == postId) postIndex = i; return post.id == postId})[0]
  var likedUsers = post.likes.map((like:any) => {return like.userId})
  setPostLiked(likedUsers.includes(uid));
}

export function ExpandedImage(props:any) {

  const [postLiked, setPostLiked] = React.useState(false);

  if (props.postId === -1) {
    return <></>;
  }

  var posts = props.posts
  var postIndex = -1;
  var post = posts.filter((post:any, i:any) => {if (post.id == props.postId) postIndex = i; return post.id == props.postId})[0]
  var likedUsers = post.likes.map((like:any) => {return like.userId})
  var uid = props.uid;
  
  React.useEffect(() => {
    setPostLiked(likedUsers.includes(props.uid))
  }, [])

  var following = props.following;

  return (
    <>
      <DialogTitle id="draggable-dialog-title" sx={{fontWeight: "400", width:"550px", display: { xs: 'none', md: 'block' }}} >
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
            onClick={() => {props.setOpenComment(false); props.setOpenImageDialog(false);}}
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
        <Carousel sx={{ height: "80%", alignItems:"center"}} autoPlay={false}>
          {post.images.map((image:any, i:number) => 
            {
            return (
            <div key={"img:"+post.id+":"+i}>
                <div style={{
                  position:"absolute",
                  zIndex: "2", 
                  background:"grey", 
                  opacity: 0.9, 
                  borderRadius:"15px",
                  color:"white",
                  display:"flex",
                  justifyContent:"space-between"
                }}>
                  <Avatar sx={{
                    margin:"5px",
                    position:'relative'
                  }}
                  />
                  <a style={{display:"inline-block", margin:"7px"}} href={'/profile?handle='+image.author.handle}>{image.author.displayname}</a>
                  {
                    image.authorId !== uid
                    ? <Button variant="soft" color="neutral"  sx={{
                      display:"inline-block",
                      borderRadius:"15px",
                      margin: "5px"
                      }}
                      >
                        {following.map((follow:any) => {return follow.id}).includes(image.authorId) ?  "Unfollow" : "Follow"}
                      </Button>
                    : ""
                  }
                </div>
                <img src={image.url} alt="" style={{
                  objectFit: "cover",
                  zIndex: 1,
                  width:"500px",
                  height: "500px",
                  borderRadius:"15px",
                }}/>
              </div>)
            }
          )}
        </Carousel>
        <Grid container spacing={4}>
          <Grid item xs={8}>
            <h1 style={{fontSize:"15px", fontWeight:"bold"}}>{post.title}</h1>
            <h1 style={{
              fontSize:"13px", 
              fontWeight:"bold", 
              overflow:"hidden",
              display:"-webkit-box",
              WebkitBoxOrient:"vertical",
              WebkitLineClamp: 2,
            }}>
              {post.images[0].author.displayname}
              &nbsp;
              <span style={{fontWeight:"normal"}}>{post.caption}</span>
            </h1>
          </Grid>
          <Grid item xs={4}>
            <Grid container spacing={0}>
              <Grid item xs={4} sx={{textAlign: "center"}}>
                {likedUsers.includes(props.uid) ? 
                  <FavoriteIcon sx={{fontSize:30, color:"red"}} onClick={() =>{
                    updateProps(props.postId, posts, props.setPosts, uid, setPostLiked);
                  }}/> 
                  : 
                  <FavoriteBorderOutlinedIcon sx={{fontSize:30, color:"grey"}} onClick={() =>{
                    updateProps(props.postId, posts, props.setPosts, uid, setPostLiked);
                  }}/>
                }
                <h1 style={{fontSize: "15px"}}>{post.likes.length}</h1>
              </Grid>
              <Grid item xs={4} sx={{textAlign: "center"}}>
                <MapsUgcRoundedIcon sx={{fontSize:30, color:"grey"}} onClick={()=>{props.setOpenComment(!props.openComment)}}/>
                <h1 style={{fontSize: "15px"}}>{post.comments.length}</h1>
              </Grid>
              <Grid item xs={4} sx={{textAlign: "center"}}>
                <BookmarkBorderOutlinedIcon sx={{fontSize:30, color:"grey"}}/>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </DialogTitle>
    </>
  )
}
