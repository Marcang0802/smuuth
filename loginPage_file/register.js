// Import Firebase SDK functions
import {initializeApp} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import {getAuth, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import {getFirestore, doc, setDoc, getDoc} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyByPrDz810_ttwZz0BdAJkeP54rMIqH3uw",
  authDomain: "wad2-505be.firebaseapp.com",
  projectId: "wad2-505be",
  storageBucket: "wad2-505be.firebasestorage.app",
  messagingSenderId: "221863917439",
  appId: "1:221863917439:web:2a517ca11c83e991388c4a",
  measurementId: "G-L69GG585GF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

// Utility functions
function validateEmail(email) {
  const re = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
  return re.test(String(email).toLowerCase());
}

function validatePassword(password) {
  return password.length >= 6;
}

// async function createUserDocument(userId, email) {
//   try {
//     await setDoc(doc(db, "users", userId), {
//       email,
//       createdAt: new Date(),
//       points: 0,
//       certifications: [],
//     });
//   } catch (error) {
//     console.error("Error creating user document:", error);
//     throw error;
//   }
// }

// DOM Elements
document.addEventListener("DOMContentLoaded", function() {
  const submit = document.getElementById("submit");
  const googleButton = document.getElementById("google");
  const errorMessageDisplay = document.getElementById("error-message");

  if (!submit || !googleButton || !errorMessageDisplay) {
    console.error("Error: Missing required DOM elements.");
    return;
  }

  // Email/Password Registration
  submit.addEventListener("click", async (event) => {
    event.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    errorMessageDisplay.innerText = "";
    if (!validateEmail(email)) {
      errorMessageDisplay.innerText = "Invalid email format.";
      return;
    }
    if (!validatePassword(password)) {
      errorMessageDisplay.innerText = "Password must be at least 6 characters.";
      return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      // await createUserDocument(user.uid, email);
      // localStorage.setItem("userUID", user.uid);
      await showCustomAlert('You can now log in!', 'success');
      window.location.href = "login.html";
    } catch (error) {
      console.error("Registration error:", error);
      console.error("Error code:", error.code);
      console.error("Error message:", error.message);
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessageDisplay.innerText = "This email is already registered. Please try logging in instead, or if you need to re-register, delete your account from your profile page first.";
          break;
        case 'auth/invalid-email':
          errorMessageDisplay.innerText = "Invalid email format.";
          break;
        case 'auth/weak-password':
          errorMessageDisplay.innerText = "Weak password. Please provide a stronger password.";
          break;
        default:
          errorMessageDisplay.innerText = "An error occurred during registration. Please try again.";
      }
    }
  });

  // Google Sign-Up
  googleButton.addEventListener("click", async () => {
    errorMessageDisplay.innerText = "";
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // // Check if user already exists in Firestore
      // const userDocRef = doc(db, "users", user.uid);
      // const userSnapshot = await getDoc(userDocRef);

      // if (!userSnapshot.exists()) {
      //   await createUserDocument(user.uid, user.email);
      // }

      // localStorage.setItem("userUID", user.uid);
      window.location.href = "./profile.html";
    } catch (error) {
      console.error("Google Sign Up Error:", error);
      errorMessageDisplay.innerText = "Google Sign Up failed. Please try again.";
    }
  });
});
