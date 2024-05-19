const { initializeApp, applicationDefault } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');
const { getFirestore } = require('firebase-admin/firestore');
const firebase = require('firebase/app');
require('firebase/auth');

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
};

const adminConfig = {
    credential: applicationDefault(),
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
};

const app = firebase.initializeApp(firebaseConfig);

const adminApp = initializeApp(adminConfig);
const adminAuth = getAuth(adminApp);
const db = getFirestore(adminApp);

module.exports = { app, adminAuth, db, firebase };


