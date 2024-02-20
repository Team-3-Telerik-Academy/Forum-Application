import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

/**
 * Firebase configuration object.
 * @typedef {Object} FirebaseConfig
 * @property {string} apiKey - The API key for Firebase.
 * @property {string} authDomain - The authentication domain for Firebase.
 * @property {string} projectId - The project ID for Firebase.
 * @property {string} storageBucket - The storage bucket for Firebase.
 * @property {string} messagingSenderId - The messaging sender ID for Firebase.
 * @property {string} appId - The app ID for Firebase.
 * @property {string} databaseURL - The database URL for Firebase.
 */

/**
 * Firebase configuration.
 * @type {FirebaseConfig}
 */
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

/**
 * Initializes the Firebase app with the provided configuration.
 * 
 * @param {Object} firebaseConfig - The configuration object for Firebase.
 * @returns {Object} - The initialized Firebase app.
 */
export const app = initializeApp(firebaseConfig);

/**
 * The authentication object for Firebase.
 * @type {Auth}
 */
export const auth = getAuth(app);

/**
 * The Firebase database instance.
 * @type {import("firebase/database").Database}
 */
export const db = getDatabase(app);