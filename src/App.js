import "./App.css";
import Favicon from "react-favicon";
import Post from "./components/Post";
import { useEffect, useState } from "react";
import { db, auth } from "./firebase";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import { Input } from "@mui/material";
import ImageUpload from "./components/ImageUpload";

// <Favicon  />
function App() {
  // Document ID : SWD2j6HjvyA2DezkObvU
  const [posts, setPosts] = useState([]);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [openSignIn, setOpenSignIn] = useState(false);
  // we use MaterialUI modal to give signin functionality
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  // useEffect() Runs a piece of code based on a specific condition
  // [] has conditions come
  // empty [] means it will run only once
  // [posts] means everytime post change piece of code works
  useEffect(() => {
    // This is where the code runs
    // Every document we make in our realtime database in firebase all that is pushed in from below code
    // posts is name of our collection
    // docs is document we create
    // doc.id is id of each documents means post we have created in database
    // we use map function to map over all documents inside collection 'posts'
    // orderBy will order posts by timestamp in descending order
    db.collection("posts")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) => {
        setPosts(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            post: doc.data(),
          }))
        );
      });
  }, []);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        // User has logged in
        console.log("user is ", authUser);
        setUser(authUser);
      } else {
        // User has logged out
        setUser(null);
      }
    });

    return () => {
      // As useEffect fires perform some actions
      unsubscribe();
    };
  }, [user, username]);
  const signUp = (event) => {
    event.preventDefault();
    auth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        return authUser.user.updateProfile({
          displayName: username,
        });
      })
      .catch((error) => alert(error.message));

    // Close the Modal once the Sign Up is done means button is pressed
    handleClose();
    document.getElementsByClassName("app_signup").reset();
  };

  // This function is for sign in button functionality
  const signIn = (event) => {
    event.preventDefault();
    auth
      .signInWithEmailAndPassword(email, password)
      .catch((error) => alert(error.message));

    // Close the Modal once the Sign In is done means button is pressed
    setOpenSignIn(false);
  };

  return (
    <div className="App">
      {/*
      {user ? (
        <Button onClick={() => auth.signOut()}>Log out</Button>
      ) : (
        <div className="app_loginContainer">
          <Button onClick={() => setOpenSignIn(true)}>Sign In</Button>
          <Button onClick={handleOpen}>Sign Up</Button>
        </div>
      )}
      */}
      {/* The below module is for Sign up */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <form className="app_signup">
            <center>
              <img
                src="https://www.pngmart.com/files/21/Instagram-PNG-Pic.png"
                alt="Instagram Logo"
                className="app_headerImage"
              />
            </center>
            <Input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Input
              type="text"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" onClick={signUp}>
              Sign Up
            </Button>
          </form>
        </Box>
      </Modal>
      {/* The below module is for Sign in */}
      <Modal
        open={openSignIn}
        onClose={() => setOpenSignIn(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <form className="app_signup">
            <center>
              <img
                src="https://www.pngmart.com/files/21/Instagram-PNG-Pic.png"
                alt="Instagram Logo"
                className="app_headerImage"
              />
            </center>
            <Input
              type="text"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" onClick={signIn}>
              Sign In
            </Button>
          </form>
        </Box>
      </Modal>
      <Favicon url="https://i.pinimg.com/originals/72/9f/77/729f7798561be2cb67f39e916a22eb6a.png"></Favicon>
      {/* Header */}
      <div className="app_header">
        <img
          src="https://www.pngmart.com/files/21/Instagram-PNG-Pic.png"
          alt="Instagram Logo"
          className="app_headerImage"
        />
        {user ? (
          <Button className="appjs_button" onClick={() => auth.signOut()}>
            Log out
          </Button>
        ) : (
          <div className="app_loginContainer">
            <Button
              className="appjs_button"
              onClick={() => setOpenSignIn(true)}
            >
              Sign In
            </Button>
            <Button className="appjs_button" onClick={handleOpen}>
              Sign Up
            </Button>
          </div>
        )}
      </div>
      <div className="app_posts">
        {/* Posts */}
        {/* We are passing the user in posts as prop because we need the user that signed in so that we can show the comments he has done  */}
        {posts.map(({ id, post }) => (
          <Post
            user={user}
            key={id}
            postId={id}
            username={post.username}
            caption={post.caption}
            imageUrl={post.imageUrl}
            className="app_post"
          />
        ))}
        {/* Posts */}
      </div>
      {/* Now we create a image uploader where we can create a post of our own */}
      {/* if user is logged in then pass the username to imageUpload.jsx so that we can store it in database and if user is not logged in then display an h3 */}
      {/* "?" with user?.displayName is called optional operaator to make it optional */}

      {user?.displayName ? (
        <ImageUpload username={user.displayName} />
      ) : (
        <h3 className="app_need">Sorry ! You need to Login to Upload.</h3>
      )}
    </div>
  );
}

export default App;
