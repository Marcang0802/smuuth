// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import { getFirestore, collection, addDoc, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";
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


const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const provider = new GoogleAuthProvider()
const db = getFirestore(app);
//clear leftover data from previous session
localStorage.clear()
const googleLogin = document.getElementById("google")
googleLogin.addEventListener("click", function () {
    signInWithPopup(auth, provider)
        .then((result) => {
            // This gives you a Google Access Token. You can use it to access the Google API.
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;
            // The signed-in user info.
            const user = result.user;
            onAuthStateChanged(auth, async (user) => {
                if (user) {
                    let profileExist = false;
                    const profilesRef = collection(db, "profiles");
                    const q = query(profilesRef, where("userId", "==", user.uid));
                    const querySnapshot = await getDocs(q);
                    querySnapshot.forEach((doc) => {
                        profileExist = true;
                        localStorage.setItem('profileID', doc.id)
                    });
                    if (profileExist) {
                        window.location.replace("../homePage/index.html");
                    }
                } else {
                    window.location.replace("./profile.html");
                }
            });
            // localStorage.setItem("userUID", user.uid); // Store user UID
            // window.location.replace("profile.html");
            // IdP data available using getAdditionalUserInfo(result)
            // ...
        }).catch((error) => {
            // Handle Errors here.
            const errorCode = error.code;
            const errorMessage = error.message;
            // The email of the user's account used.
            const email = error.customData.email;
            // The AuthCredential type that was used.
            const credential = GoogleAuthProvider.credentialFromError(error);
            // ...
        });
})

function validateEmail(email) {
    const re = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
    return re.test(String(email).toLowerCase());
}

function validatePassword(password) {
    return password.length >= 6;
}

const login = document.getElementById("login");
login.addEventListener("click", function (event) {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const errorMessageDisplay = document.getElementById("error-message");
    errorMessageDisplay.innerText = "";

    if (!validateEmail(email)) {
        errorMessageDisplay.innerText = "Invalid email format.";
        return;
    }

    if (!validatePassword(password)) {
        errorMessageDisplay.innerText = "Password must be at least 6 characters.";
        return;
    }

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            // localStorage.setItem("userUID", user.uid); // Store user UID
            onAuthStateChanged(auth, async (user) => {
                if (user) {
                    let profileExist = false;
                    const profilesRef = collection(db, "profiles");
                    const q = query(profilesRef, where("userId", "==", user.uid));
                    const querySnapshot = await getDocs(q);
                    querySnapshot.forEach((doc) => {
                        console.log('a')
                        profileExist = true;
                        localStorage.setItem('profileID', doc.id)
                    });
                    if (profileExist) {
                        window.location.replace("../homePage/index.html");
                    }
                    else {
                        console.log('a')
                        window.location.replace("./profile.html");
                    }
                }
                // window.location.replace("profile.html");
            })
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            if (errorCode === 'auth/invalid-credential') {
                errorMessageDisplay.innerText = "Invalid username or password. Please try again.";
            }
            else {
                errorMessageDisplay.innerText = errorMessage;
            }
        });
}
)



