// js/firebase.js

import { initializeApp } from
  "https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js";

import { getAuth } from
  "https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js";

import { getFirestore } from
  "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

// Reemplazá este objeto con el que te muestra Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDnJNhRVVBqXCegI69JcoONVzn_eqe1GFI",
    authDomain: "en-cancha-afb6a.firebaseapp.com",
    projectId: "en-cancha-afb6a",
    storageBucket: "en-cancha-afb6a.firebasestorage.app",
    messagingSenderId: "923813497689",
    appId: "1:923813497689:web:0102894d2a77cf44cf5a48",
    measurementId: "G-C6TCWD97S7"
  };

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// Inicializa Authentication
const auth = getAuth(app);

// Inicializa Firestore
const db = getFirestore(app);

// Permite utilizar auth y db desde otros archivos
export { auth, db };



  

