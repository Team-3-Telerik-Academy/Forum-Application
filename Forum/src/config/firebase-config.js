import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

export const firebaseConfig = {
  apiKey: "AIzaSyBG_bqVTR2ba59zfG9eFvT1SsU1frB56E8",
  authDomain: "im-hobby-forum.firebaseapp.com",
  projectId: "im-hobby-forum",
  storageBucket: "im-hobby-forum.appspot.com",
  messagingSenderId: "531152872742",
  appId: "1:531152872742:web:a61533da9630bc37d78de7",
  databaseURL:
    "https://im-hobby-forum-default-rtdb.europe-west1.firebasedatabase.app/",
};

export const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const db = getDatabase(app);