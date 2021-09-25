import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/storage";
import "firebase/compat/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBzpepcFS5peiGUQN6FOrX6QIvCAsNGY_w",
  authDomain: "notetab-8de87.firebaseapp.com",
  databaseURL: "https://notetab-8de87.firebaseio.com",
  projectId: "notetab-8de87",
  storageBucket: "notetab-8de87.appspot.com",
  messagingSenderId: "733243458605",
  appId: "1:733243458605:web:7cde8fbcb3569c3b1ce4a4",
  measurementId: "G-S0CKFBH9GF",
};

const appMain = !firebase.apps.length
  ? firebase.initializeApp(firebaseConfig)
  : firebase.app();

const db = appMain.firestore();
const storage = appMain.storage();
const auth = appMain.auth();

export { db, storage, appMain, auth };
