
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-app.js";
import { getFirestore, collection, doc, setDoc, updateDoc, getDoc } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-firestore.js";


const firebaseConfig = {
  apiKey: "AIzaSyByPrDz810_ttwZz0BdAJkeP54rMIqH3uw",
  authDomain: "wad2-505be.firebaseapp.com",
  databaseURL: "https://wad2-505be-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "wad2-505be",
  storageBucket: "wad2-505be.firebasestorage.app",
  messagingSenderId: "221863917439",
  appId: "1:221863917439:web:2a517ca11c83e991388c4a",
  measurementId: "G-L69GG585GF"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app)

async function getPoints() {
  // get userUID from the browser localStorage, change 'userUID' if needed
  let userUID = localStorage.getItem("userUID");
  // get user document reference from firestore
  const userRef = doc(db, "users", userUID);
  // Fetch the document
  const userData = await getDoc(userRef);

  if (userData.exists()) {
    return userData.data().point;
  } else {
    console.log("User does not exist.");
  }
}

// operation = '+' or '-'
async function updatePoints(amount, operation) {
  // get userUID from the browser localStorage, change 'userUID' if needed
  let userUID = localStorage.getItem("userUID");
  // get user document reference from firestore
  const userRef = doc(db, "users", userUID);
  const userData = await getDoc(userRef);
  // get current points
  let currentPoints = userData.data().point
  
  if (operation === '+') {
    await updateDoc(userRef, {
      point: currentPoints + amount
    });
  }
  else if (operation === '-') {
    if (currentPoints - amount < 0) { //so points don't go below 0
      await updateDoc(userRef, {
        point: 0
      })
    }
    else {
      await updateDoc(userRef, {
        point: currentPoints - amount
      });
    }
  }
}














