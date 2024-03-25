// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { /* connectFirestoreEmulator, */ getFirestore } from 'firebase/firestore';
import { /* connectAuthEmulator, */ getAuth } from 'firebase/auth';
import { /* connectStorageEmulator, */ getStorage } from 'firebase/storage';
// import { isDev } from '../isDev';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// const firebaseConfig = {
//     apiKey: 'FILL_ME_IN',
//     authDomain: 'FILL_ME_IN',
//     projectId: 'FILL_ME_IN',
//     storageBucket: 'FILL_ME_IN',
//     messagingSenderId: 'FILL_ME_IN',
//     appId: 'FILL_ME_IN',
// };
const firebaseConfig = {
    apiKey: "AIzaSyBa9uII9Z6RL-4htNJebVPls6v6-dinnQ0",
    authDomain: "miniextensions-be58f.firebaseapp.com",
    projectId: "miniextensions-be58f",
    storageBucket: "miniextensions-be58f.appspot.com",
    messagingSenderId: "676693011829",
    appId: "1:676693011829:web:2aead298d89343e8d8b73c",
    measurementId: "G-HCHXQC89G3"
};

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig);

export const firestore = getFirestore(firebaseApp);
// export const baseBucketName = 'FILL_ME_IN';
export const baseBucketName = 'miniExtensions';

export const firebaseAuth = getAuth(firebaseApp);

/* if (isDev) {
    connectFirestoreEmulator(firestore, '127.0.0.1', 8081);
} */
