import { initializeApp, getApp, getApps } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBJ0wYj2_SvRCFPN6nRwjiOMgodLQK4VCw",
  authDomain: "fabrika-yonetim-bilgi.firebaseapp.com",
  databaseURL: "https://fabrika-yonetim-bilgi-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "fabrika-yonetim-bilgi",
  storageBucket: "fabrika-yonetim-bilgi.firebasestorage.app",
  messagingSenderId: "158963818336",
  appId: "1:158963818336:web:9801bc98279b16c05e0805",
  measurementId: "G-KH05SB10QG"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const database = getDatabase(app);

export { database };
