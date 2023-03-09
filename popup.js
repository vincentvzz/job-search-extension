// need to download firebase app and firebase firestore locally
import { initializeApp } from "./firebase-app.js";
import { getFirestore, collection, query, where, doc, addDoc, setDoc, getDocs, updateDoc, arrayUnion } from "./firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyB5UX2SHZ4Mzc1XvF5UgDvTGd4WLwBOsQc",
    authDomain: "job-search-website-vz.firebaseapp.com",
    databaseURL: "https://job-search-website-vz-default-rtdb.firebaseio.com",
    projectId: "job-search-website-vz",
    storageBucket: "job-search-website-vz.appspot.com",
    messagingSenderId: "885937389036",
    appId: "1:885937389036:web:4321a4b35e152aab6554c9",
    measurementId: "G-4NSDHCC0QM"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const userCollection = collection(db, "user");

let current_url = "";
let currentUserId = "";

chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
    current_url = tabs[0].url;
    // use `url` here inside the callback because it's asynchronous!
});

document.getElementById("add-job").addEventListener("click", async () => {
    let current_company = document.getElementById("company-name-input").value;
    let usernameInput = document.getElementById("username").value;
    if (username != "") {
        try {
            const findUserQuery = query(userCollection, where("username", "==", usernameInput));
            const userQueryResult = await getDocs(findUserQuery);
            if (userQueryResult.docs.length === 0) {
                await addDoc(userCollection, {
                    username: usernameInput,
                    jobs: [],
                }).then((newDoc) => { currentUserId = newDoc.id });
            } else {
                currentUserId = userQueryResult.docs[0].id;
            }
            const curJob = {
                title: document.getElementById("job-title").value,
                companyName: current_company,
                jdLink: current_url,
                status: "Interested"
            };
            await updateDoc(doc(db, "user", currentUserId), {
                jobs: arrayUnion(curJob)
            });
        } catch (e) {
            console.log(e);
        }
    }
    let result = await chrome.storage.local.get({"company_list": {}});

    console.log(result);
    result["company_list"][current_company] = current_url;
    await chrome.storage.local.set({"company_list": result["company_list"]});
})

// https://www.geeksforgeeks.org/how-to-create-and-download-csv-file-in-javascript/
document.getElementById("download-btn").addEventListener("click", async () => {
    const result = await chrome.storage.local.get({"company_list": {}});
    let csv_temp_data = ["Company Name,Job URL"];
    Object.keys(result["company_list"]).forEach((curKey) => {
        csv_temp_data.push(curKey + "," + result["company_list"][curKey]);
    });
    const csv_data = csv_temp_data.join("\n");

    const blob = new Blob([csv_data], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.setAttribute('href', url)
    a.setAttribute('download', 'job_list.csv');
    a.click();
})