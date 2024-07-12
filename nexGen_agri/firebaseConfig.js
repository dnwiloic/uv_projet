import AsyncStorage from "@react-native-async-storage/async-storage";
//import { getAnalytics, isSupported } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import { getReactNativePersistence, initializeAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAfnLqAaZ_wMwqmLjC7z9dSs8oyySjOI-w",
  authDomain: "nexgen-agri-4c462.firebaseapp.com",
  projectId: "nexgen-agri-4c462",
  storageBucket: "nexgen-agri-4c462.appspot.com",
  messagingSenderId: "478766050761",
  appId: "1:478766050761:web:b18e5caf8e6176649c4c18",
  measurementId: "G-6BNYHP9QMT",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
const firestore = getFirestore(app);

export { app, auth, firestore };
