import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-app.js";
import { getFirestore, collection, doc, setDoc, updateDoc, getDoc, deleteDoc, getDocs, addDoc } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-firestore.js";


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
const db = getFirestore(app);

//System Admin only
// data = {rewardName(str), pointAmount(int), redeemLimit(int), redeemedUser(array containing userID)}
export async function addReward(data) {
  try {
    await addDoc(collection(db, "rewards"), data);
    alert("Reward added successfully!");
  } catch (error) {
    console.error("Error adding reward:", error);
    alert("Failed to add reward. Check console for details.");
  }
}

export async function deleteReward(rewardID) {
  // Create a reference to the user document
  const rewardRef = doc(db, "rewards", rewardID);
  // Delete the document
  await deleteDoc(rewardRef);
}

//for helper and club admin
//
//function for population
export async function getAllRewards() {
  const rewardsArray = [];
  const rewardRef = collection(db, "rewards");
  const querySnapshot = await getDocs(rewardRef);
  querySnapshot.forEach((doc) => {
    let reward = {id: doc.id,
      data: doc.data()
    }
    rewardsArray.push(reward)
  });
  return rewardsArray;
}


export async function redeemReward(rewardID) {
  let userUID = localStorage.getItem('userUID');
  const rewardRef = doc(db, 'rewards', rewardID);
  const reward = await getDoc(rewardRef);
  let redeemedUsers = reward.data().redeemedUser;
  if (redeemedUsers.length < (reward.data().redeemLimit)) {
    redeemedUsers.push(userUID)
    console.log(redeemedUsers)
    await updateDoc(rewardRef, {
      redeemedUser: redeemedUsers
    });
  }
  else {
    alert('Sorry, no more rewards of this type!')
    console.log("Sorry, no more rewards of this type!")
  }
}

