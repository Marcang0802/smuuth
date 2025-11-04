import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import { showCustomAlert } from "../homePage/js/custom-alert-module.js";

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

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export async function checkLogin(){
    onAuthStateChanged(auth, async (user)=>{
        if(!user){
            await showCustomAlert('Access Denied. Please log in to continue.', 'warning', 'Access Denied');
            window.location.replace('../landingPage.html')
        }
    })
}