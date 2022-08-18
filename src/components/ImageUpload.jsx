import React, { useState } from "react";
import "../css/ImageUpload.css";
import Button from "@mui/material/Button";
import { db, storage } from "../firebase.js";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import firebase from "../firebase.js";

const ImageUpload = ({ username }) => {
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState(null);
  const [progress, setProgress] = useState(0);
  const handleChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    // when we browse a file and select it , "image" is reference to the file we have selected
    // image.name is reference to that selected image and .put store that image in firebase storage
    if (!image) return;
    const storageRef = ref(storage, `/images/${image.name}`);
    const uploadTask = uploadBytesResumable(storageRef, image);
    uploadTask.on(
      // As image gets uploaded keep giving me the snapshots
      // The below code is just for progress bar
      "state_changed",
      (snapshot) => {
        // progress function
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(progress);
      },
      (error) => {
        // Error Function..
        console.log(error);
        alert(error.message);
      },
      () => {
        // On Complete Function.....
        // "images" comes from uploadTask function defination storage.ref('images/${image.name})
        // our selected image is getting stored inside firebase storage so we need to get its download URL to get its reference
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          // post image inside db
          db.collection("posts").add({
            // we need timeStamp according to server Timestamp so that newest post remain at the top
            // Earlier we were creating document inside our database manually now we use downloadURL to set our caption , image inside our database inside the collection named "posts"
            // timestamp gives us server time timesamps so that we can show latest post at top
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            caption: caption,
            imageUrl: url,
            username: username,
          });
          setProgress(0);
          setCaption("");
          setImage(null);
        });
      }
    );
  };
  return (
    <>
      <div className="imageUpload">
        {/* Post Creater */}
        {/* Caption Input */}
        {/* File pick */}
        {/* Post Button */}
        <progress className="imageUpload_progress" value={progress} max="100" />
        <input
          type="text"
          placeholder="Enter a Caption.."
          onChange={(event) => setCaption(event.target.value)}
          className="imageUpload_input"
          value={caption}
        />
        <input
          type="file"
          className="imageUpload_input"
          onChange={handleChange}
        />
        <Button className="imageUpload_upload" onClick={handleUpload}>
          Upload
        </Button>
      </div>
    </>
  );
};

export default ImageUpload;
