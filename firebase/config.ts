// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCEIQsefb2tIdf6SXYZ_MzAw1r7ZrDXcas",
  authDomain: "miniblog-4c000.firebaseapp.com",
  projectId: "miniblog-4c000",
  storageBucket: "miniblog-4c000.firebasestorage.app",
  messagingSenderId: "845314229540",
  appId: "1:845314229540:web:21502a012cbd91e698dfb1",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

export { db };
