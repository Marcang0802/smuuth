
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getFirestore, collection, addDoc, query, where, getDocs, doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-storage.js";

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

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);


//if profileID not initialized, will initialize
if (localStorage.getItem('profileID') == null) {
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      console.log(user.uid)
      const profilesRef = collection(db, "profiles");
      const q = query(profilesRef, where("userId", "==", user.uid));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        localStorage.setItem('profileID', doc.id);
        window.location.reload();
      });
    }
  });
}


export async function getPoints(profileID) {
  // get user document reference from firestore
  const profilesRef = doc(db, "profiles", profileID);
  // Fetch the document
  const profileData = await getDoc(profilesRef);

  if (profileData.exists()) {
    return profileData.data().points;
  } else {
    console.log("User does not exist.");
  }
}

// operation = '+' or '-'
export async function updatePoints(amount, operation, profileID) {
  amount = Number(amount);
  // get user document reference from firestore
  const profilesRef = doc(db, "profiles", profileID);
  const profilesData = await getDoc(profilesRef);
  // get current points
  let currentPoints = profilesData.data().points

  if (operation === '+') {
    await updateDoc(profilesRef, {
      points: currentPoints + amount
    });
    return true
  }
  else if (operation === '-') {
    if ((currentPoints - amount) < 0) { //Check if points will go below 0
      alert('Not enough points.')
      console.log('Not enough points.')
      return false
    }
    else {
      await updateDoc(profilesRef, {
        points: currentPoints - amount
      });
      return true
    }
  }
}




























