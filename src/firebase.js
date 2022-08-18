import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import { getStorage } from "firebase/storage";
// import { initializeApp } from "firebase/app";
import "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyA8tNc-2Sk3pg5vdLfiq-v9eZxqW8Mxg08",
  authDomain: "instagram-clone-cbfe0.firebaseapp.com",
  projectId: "instagram-clone-cbfe0",
  storageBucket: "instagram-clone-cbfe0.appspot.com",
  messagingSenderId: "964825112421",
  appId: "1:964825112421:web:ee91e45a2590df323bcb8c",
  measurementId: "G-7C91GWHJMW",
};

// Use this to initialize the firebase App
export const firebaseApp = firebase.initializeApp(firebaseConfig);

// Use these for db & auth
const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = getStorage(firebaseApp);
// const storage = getStorage(firebaseApp);

export default firebase;
export { auth, db, storage };
