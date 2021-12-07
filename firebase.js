// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyB4Hey9wGLYSSnMrHLk2onCIhn2Xy0oReA',
  authDomain: 'mern-tinder-clone-59149.firebaseapp.com',
  projectId: 'mern-tinder-clone-59149',
  storageBucket: 'mern-tinder-clone-59149.appspot.com',
  messagingSenderId: '820222762520',
  appId: '1:820222762520:web:aa840a7851056f143a2d6d',
}

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp()
const db = getFirestore()
const storage = getStorage()

export { app, db, storage }
