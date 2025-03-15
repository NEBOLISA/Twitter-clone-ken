
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import {getStorage} from "firebase/storage"
const firebaseConfig = {
  apiKey: "AIzaSyA9sdfxqMGC-cE0zV2Kt2PB7vDXglVLEq8",
  authDomain: "artisanapp-c7e58.firebaseapp.com",
  databaseURL: "https://artisanapp-c7e58-default-rtdb.firebaseio.com",
  projectId: "artisanapp-c7e58",
  storageBucket: "artisanapp-c7e58.appspot.com",
  messagingSenderId: "854477481878",
  appId: "1:854477481878:web:b7803419451872fdb0dfb7",
  measurementId: "G-5VBRS4T360"
};


const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export {storage}

