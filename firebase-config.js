// firebase-config.js
const firebaseConfig = {
  apiKey: "AIzaSyBZzBUO2vZww1_UBWK0pwIpFMHC79JciKk",
  authDomain: "bioline-3715e.firebaseapp.com",
  projectId: "bioline-3715e",
  storageBucket: "bioline-3715e.appspot.com",
  messagingSenderId: "315361711020",      // <-- get this from Firebase
  appId: "1:315361711020:web:937fe39e739d066725e009" // <-- get this from Firebase
};

  
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  
  // Export the auth and firestore services
  const auth = firebase.auth();
  const db = firebase.firestore();