
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getFirestore, collection, addDoc, query, where, getDocs, doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

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

function showCustomAlert(message, type = 'info', title = null) {
			return new Promise((resolve) => {
				const overlay = document.getElementById('customAlertOverlay');
				const icon = document.getElementById('customAlertIcon');
				const titleEl = document.getElementById('customAlertTitle');
				const messageEl = document.getElementById('customAlertMessage');
				const okBtn = document.getElementById('customAlertOkBtn');
				// Set icon based on type
				const icons = {
					success: '<i class="fa fa-check-circle"></i>',
					error: '<i class="fa fa-times-circle"></i>',
					warning: '<i class="fa fa-exclamation-triangle"></i>',
					info: '<i class="fa fa-info-circle"></i>'
				};
        // console.log(icon)
				icon.innerHTML = icons[type] || icons.info;
				icon.className = `custom-alert-icon ${type}`;
				// Set title
				const titles = {
					success: 'Success!',
					error: 'Error',
					warning: 'Warning',
					info: 'Information'
				};
				titleEl.textContent = title || titles[type] || 'Alert';
				// Set message
				messageEl.textContent = message;
				// Show overlay
				overlay.classList.add('show');
				// Handle OK button
				const handleOk = () => {
					overlay.classList.remove('show');
					okBtn.removeEventListener('click', handleOk);
					overlay.removeEventListener('click', handleOverlayClick);
					resolve(true);
				};
				// Handle clicking outside
				const handleOverlayClick = (e) => {
					if (e.target === overlay) {
						handleOk();
					}
				};
				okBtn.addEventListener('click', handleOk);
				overlay.addEventListener('click', handleOverlayClick);
			});
		}


//if profileID not initialized, will initialize
if (localStorage.getItem('profileID') == null) {
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      // console.log(user.uid)
      const profilesRef = collection(db, "profiles");
      const q = query(profilesRef, where("userId", "==", user.uid));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        let profileID = doc.id;
        localStorage.setItem('profileID', profileID);
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
      await showCustomAlert('Not enough points.','info')
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





























