// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";


// Your web app's Firebase configuration


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



// Function to validate email format
function validateEmail(email) {
  const re = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
  return re.test(String(email).toLowerCase());
}

// Function to validate password
function validatePassword(password) {
  return password.length >= 6;
}

// Function to create user document in Firestore
async function createUserDocument(userId, email) {
  try {
    await setDoc(doc(db, "users", userId), {
      email: email,
      createdAt: new Date(),
      // Add any other initial user data you want to store
    });
  } catch (error) {
    console.error("Error creating user document:", error);
    throw error;
  }
}

document.addEventListener("DOMContentLoaded", function() {
  const submit = document.getElementById("submit");
  const errorMessageDisplay = document.getElementById("error-message");

  if (!submit || !errorMessageDisplay) {
    console.error("Error: Submit button or error message container not found.");
    return;
  }

  submit.addEventListener("click", async function(event) {
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
      // Create authentication user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Create user document in Firestore
      await createUserDocument(user.uid, email);

      localStorage.setItem("userUID", user.uid);
      window.location.href = "login.html";
    } catch (error) {
      console.error("Registration error:", error);

      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessageDisplay.innerText = "This email is already in use. Please use a different one.";
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
});
