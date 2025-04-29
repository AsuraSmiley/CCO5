
const firebaseConfig = {
    apiKey: "AIzaSyAlq3HZwuk-wk2aFxERWWBm2rSH1eSXOoc",
    authDomain: "student-queue-system.firebaseapp.com",
    projectId: "student-queue-system",
    storageBucket: "student-queue-system.firebasestorage.app",
    messagingSenderId: "891032727765",
    appId: "1:891032727765:web:134c260550e58a1be6325c",
    measurementId: "G-15PJS2C6KF"
  };
  
 
  const app = firebase.initializeApp(firebaseConfig);
  const auth = firebase.auth();
  const db = firebase.firestore();
  
 
  export { app, auth, db };
  