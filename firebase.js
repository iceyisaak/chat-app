import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';


var firebaseConfig = {
  apiKey: "AIzaSyAqJpW4NzcX8z_trQBpuI6KLBNaG-HNfmg",
  authDomain: "chatapp-7e1d5.firebaseapp.com",
  projectId: "chatapp-7e1d5",
  storageBucket: "chatapp-7e1d5.appspot.com",
  messagingSenderId: "218328176238",
  appId: "1:218328176238:web:4960ad1c7fb502ef61f87f"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export const db = firebase.firestore();
export const auth = firebase.auth();

export default firebase;
