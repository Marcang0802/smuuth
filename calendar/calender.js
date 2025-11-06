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


export async function getAllJoinedEvents(profileID) {
    //get an Array of joinedEvents ID
    const profilesRef = doc(db, "profiles", profileID);
    const profileSnap = await getDoc(profilesRef);
    let joinedEventsID = profileSnap.data().joinedEvents;
    // return joinedEventsID;

    //match the ID to the events
    let result = [];
    for (let ID of joinedEventsID) {
        const eventsRef = doc(db, "events", ID);
        const eventSnap = await getDoc(eventsRef);
        //check if event exists
        if (eventSnap.exists()) {
            let eventName = eventSnap.data().name;
            let start = eventSnap.data().startDatetime;
            let end = eventSnap.data().endDatetime;
            let eventObj = { eventName: eventName, start: start, end: end, type: 'joined' };
            result.push(eventObj);
        }
        else{
            console.log('event Not found')
        }
    }
    return result;
}

export async function getAllCreatedEvents(userId) {
    //get all events where creatorId matches the userId
    const eventsRef = collection(db, "events");
    const q = query(eventsRef, where("creatorId", "==", userId));
    const querySnapshot = await getDocs(q);

    let result = [];
    querySnapshot.forEach((doc) => {
        const eventData = doc.data();
        let eventObj = {
            eventName: eventData.name,
            start: eventData.startDatetime,
            end: eventData.endDatetime,
            type: 'created'
        };
        result.push(eventObj);
    });

    return result;
}