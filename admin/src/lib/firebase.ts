import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD8zwTPf_nWbuBQaw5Qi8cnD-9DvACpAIs",
  authDomain: "kingstonchurchofchrist-8a8f3.firebaseapp.com",
  databaseURL: "https://kingstonchurchofchrist-8a8f3.firebaseio.com",
  projectId: "kingstonchurchofchrist-8a8f3",
  storageBucket: "kingstonchurchofchrist-8a8f3.firebasestorage.app",
  messagingSenderId: "849737291178",
  appId: "1:849737291178:web:c298b8e90b574903",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
