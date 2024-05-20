import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator, onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getDatabase, connectDatabaseEmulator } from 'firebase/database';
import { getStorage, connectStorageEmulator } from 'firebase/storage';

console.log("NEXT_PUBLIC_FIREBASE_API_KEY:", process.env.NEXT_PUBLIC_FIREBASE_API_KEY);
console.log("NEXT_PUBLIC_USE_FIREBASE_EMULATOR:", process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR);
console.log("FIREBASE_AUTH_EMULATOR_HOST:", process.env.FIREBASE_AUTH_EMULATOR_HOST);
console.log("FIRESTORE_EMULATOR_HOST:", process.env.FIRESTORE_EMULATOR_HOST);
console.log("FIREBASE_DATABASE_EMULATOR_HOST:", process.env.FIREBASE_DATABASE_EMULATOR_HOST);
console.log("FIREBASE_STORAGE_EMULATOR_HOST:", process.env.FIREBASE_STORAGE_EMULATOR_HOST);

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);
const database = getDatabase(app);
const storage = getStorage(app);

if (process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR === 'true') {
    console.log('Using Firebase Emulators');
    if (process.env.FIREBASE_AUTH_EMULATOR_HOST) {
        const authEmulatorHost = process.env.FIREBASE_AUTH_EMULATOR_HOST.startsWith('http')
            ? process.env.FIREBASE_AUTH_EMULATOR_HOST
            : `http://${process.env.FIREBASE_AUTH_EMULATOR_HOST}`;
        connectAuthEmulator(auth, authEmulatorHost);
        console.log(`Auth emulator connected: ${authEmulatorHost}`);
    }
    if (process.env.FIRESTORE_EMULATOR_HOST) {
        const [firestoreHost, firestorePort] = process.env.FIRESTORE_EMULATOR_HOST.split(':');
        connectFirestoreEmulator(firestore, firestoreHost, parseInt(firestorePort));
        console.log(`Firestore emulator connected: ${process.env.FIRESTORE_EMULATOR_HOST}`);
    }
    if (process.env.FIREBASE_DATABASE_EMULATOR_HOST) {
        const [databaseHost, databasePort] = process.env.FIREBASE_DATABASE_EMULATOR_HOST.split(':');
        connectDatabaseEmulator(database, databaseHost, parseInt(databasePort));
        console.log(`Database emulator connected: ${process.env.FIREBASE_DATABASE_EMULATOR_HOST}`);
    }
    if (process.env.FIREBASE_STORAGE_EMULATOR_HOST) {
        const [storageHost, storagePort] = process.env.FIREBASE_STORAGE_EMULATOR_HOST.split(':');
        connectStorageEmulator(storage, storageHost, parseInt(storagePort));
        console.log(`Storage emulator connected: ${process.env.FIREBASE_STORAGE_EMULATOR_HOST}`);
    }
}

export { app, auth, firestore, database, storage, onAuthStateChanged, signInWithEmailAndPassword, signOut };


















