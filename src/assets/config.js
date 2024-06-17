// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getFirestore} from 'firebase/firestore';
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDXNa2BkxGIrCSu8OrkAUBXeq7oGMevlNM",
  authDomain: "resolute-grin-403708.firebaseapp.com",
  projectId: "resolute-grin-403708",
  storageBucket: "resolute-grin-403708.appspot.com",
  messagingSenderId: "763914951217",
  appId: "1:763914951217:web:b041d3c9adfaa8e4931310",
  measurementId: "G-VD6JQFXXWX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const firestoreDB = getFirestore(app)
const auth = getAuth(app);
