import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";
import "firebase/functions";

const firebaseConfig = {
  // apiKey: "AIzaSyCT2n9FyFZpzBdM-eefgM3q1NooIOKmUA0",
  // authDomain: "cp3351-73e9b.firebaseapp.com",
  // projectId: "cp3351-73e9b",
  // storageBucket: "cp3351-73e9b.appspot.com",
  // messagingSenderId: "761342188736",
  // appId: "1:761342188736:web:bb5450394e29612a78e125",
  // measurementId: "G-W7HKMFEDYR",
};

import { Platform } from "react-native";
console.log("Platform.OS", Platform.OS); // ios, android

import Constants from "expo-constants";

if (firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig);

  const { manifest } = Constants;
  const ip = `${manifest.debuggerHost.split(":").shift()}`;

  firebase.firestore().useEmulator(ip, 8080);
  firebase.functions().useEmulator(ip, 5001);
  firebase.auth().useEmulator(`http://${ip}:9099`);
}

export default firebase;
