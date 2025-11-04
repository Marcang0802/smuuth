import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-app.js";
import { getFirestore, collection, doc, setDoc, updateDoc, getDoc, deleteDoc, getDocs, addDoc } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-firestore.js";
import { updatePoints } from '../points/points.js'

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

//Get the user's role
export async function getRole(profileID) {
  // get user document reference from firestore
  const profilesRef = doc(db, "profiles", profileID);
  // Fetch the document
  const profileData = await getDoc(profilesRef);
  if (profileData.exists()) {
    return profileData.data().role;
  } else {
    console.log("User does not exist.");
  }
}


//For manageReward.html
// data = {rewardName(str), pointAmount(int), redeemLimit(int), redeemedUser(array containing userID)}
// writes to the database
export async function addReward(data) {
  try {
    await addDoc(collection(db, "rewards"), data);
    alert("Reward added successfully!");
  } catch (error) {
    console.error("Error adding reward:", error);
    alert("Failed to add reward. Check console for details.");
  }
}

//delete data from database
export async function deleteReward(rewardID) {
  // Create a reference to the user document
  const rewardRef = doc(db, "rewards", rewardID);
  // Delete the document
  await deleteDoc(rewardRef);
  alert('Deleted')
}

//get all redeemedUser (refer to data on top)
export async function getAllRedeemedUsers(rewardID) {
  //create a reference 
  const rewardsRef = doc(db, "rewards", rewardID);
  // Fetch the document
  const rewardData = await getDoc(rewardsRef);
  if (rewardData.exists()) {
    //get the array of ids
    let profileUID = rewardData.data().redeemedUser;
    let result = []
    for (let id of profileUID) {
      const profilesRef = doc(db, "profiles", id);
      // Fetch the document
      const profileData = await getDoc(profilesRef);
      if (profileData.exists()) {
        //create obj of email and name of id, then push
        let object = {email: profileData.data().email,name: profileData.data().fullname};
        result.push(object);
      } 
      else {
        console.log("User does not exist.");
      }
    }
    return result
  } 
  else {
    console.log("Does not exist.");
  }
}

//for helper and club admin
//
//function for population, returns an array of all rewards in the database
export async function getAllRewards() {
  const rewardsArray = [];
  const rewardRef = collection(db, "rewards");
  const querySnapshot = await getDocs(rewardRef);
  querySnapshot.forEach((doc) => {
    let reward = {
      id: doc.id,
      data: doc.data()
    }
    rewardsArray.push(reward)
  });
  return rewardsArray;
}

//writes to the databse of the profileid
export async function redeemReward(rewardID, profileID) {
  const rewardRef = doc(db, 'rewards', rewardID);
  const reward = await getDoc(rewardRef);
  let redeemedUsers = reward.data().redeemedUser;
  if (redeemedUsers.length < (reward.data().redeemLimit)) {
    for (let user of redeemedUsers) { //check if already redeemed
      if (profileID === user) {
        alert("Already redeemed")
        return
      }
    }
    let updateStatus = await updatePoints(reward.data().pointsAmount, "-", profileID)//check if updating points successful
    if (updateStatus === true) {
      redeemedUsers.push(profileID)
      alert('successfully redeemed!')
      await updateDoc(rewardRef, {
        redeemedUser: redeemedUsers // update the array
      });
      window.location.reload() // reload the window to showcase points updating
    }
    else {
      return
    }
  }
  else {
    // if rewardLimit reached, therefore no more rewards left
    alert('Sorry, no more rewards of this type!')
    console.log("Sorry, no more rewards of this type!")
  }
}

