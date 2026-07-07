// Firebase Configuration
// Replace the config values below with the credentials from your Firebase Console.
// Go to: Firebase Project Settings -> Web Apps -> Copy the Config.

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
if (typeof firebase !== 'undefined') {
  firebase.initializeApp(firebaseConfig);
  window.db = firebase.firestore();
  window.storage = firebase.storage();
  console.log("Firebase initialized successfully.");
} else {
  console.error("Firebase SDK is not loaded. Make sure the script tags are correct.");
}
