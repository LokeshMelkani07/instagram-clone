import React, { useEffect, useState } from "react";
import "../css/Post.css";
import { Avatar } from "@mui/material";
import { deepOrange } from "@mui/material/colors";
import { db } from "../firebase";
import firebase from "../firebase";

const Post = ({ user, postId, username, caption, imageUrl }) => {
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");

  useEffect(() => {
    // Anytime there is any new comment added in a specific post this function fires and we grab each post using postID for each post
    let unsubscribe;
    if (postId) {
      unsubscribe = db
        .collection("posts")
        .doc(postId)
        .collection("comments")
        .orderBy("timestamp", "desc")
        .onSnapshot((snapshot) => {
          setComments(snapshot.docs.map((doc) => doc.data()));
        });
    }

    return () => {
      unsubscribe();
    };
  }, [postId]);

  const postComment = (event) => {
    event.preventDefault();
    db.collection("posts").doc(postId).collection("comments").add({
      text: comment,
      username: user.displayName,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });
    setComment("");
  };

  return (
    <>
      <div className="post">
        {/* header = name + icon/avatar */}
        <div className="post_header">
          <Avatar sx={{ bgcolor: deepOrange }} className="post_avatar">
            {username.substring(0, 1)}
          </Avatar>
          <h3>{username}</h3>
        </div>
        {/* image */}
        <img className="post_image" src={imageUrl} alt="" />
        {/* username + caption */}
        <h4 className="post_text">
          <strong>{username} </strong> {caption}
        </h4>
        <div className="post_comments">
          {comments.map((comment) => (
            // our db named comments has only two fields username and text and that is what we are rendering here
            <p>
              <strong>{comment.username}</strong> {comment.text}
            </p>
          ))}
        </div>
        {user && (
          <form className="post_commentBox">
            <input
              type="text"
              className="post_input"
              placeholder="Add a comment..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <button
              className="post_button"
              disabled={!comment}
              type="submit"
              onClick={postComment}
            >
              Post
            </button>
          </form>
        )}
      </div>
    </>
  );
};

export default Post;
