// js/registro.js

import { auth, db } from "./firebase.js";

import {
  createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js";

import {
  doc,
  setDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

const formulario = document.getElementById("registroForm");
const mensaje = document.getElementById("mensaje");

if (!formulario) {
  console.error("No se encontró el formulario con id='registroForm'");
} else {
  formulario.addEventListener("submit", registrarJugadora);
}

async function registrarJugadora(evento) {
  evento.preventDefault();

  const nombre = document.getElementById("nombre").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const edad = Number(document.getElementById("edad").value);
  const posicion = document.getElementById("posicion").value;

  mensaje.textContent = "Registrando...";

  try {
    // Crea el usuario en Firebase Authentication
    const credencial = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    const usuario = credencial.user;

    // Guarda el perfil en Firestore
    await setDoc(doc(db, "jugadoras", usuario.uid), {
      uid: usuario.uid,
      nombre: nombre,
      email: email,
      edad: edad,
      posicion: posicion,
      fechaRegistro: serverTimestamp()
    });

    mensaje.textContent = "Registro realizado correctamente.";

    formulario.reset();

    setTimeout(() => {
      window.location.href = "./perfil.html";
    }, 1000);

  } catch (error) {
    console.error(error);

    switch (error.code) {
      case "auth/email-already-in-use":
        mensaje.textContent =
          "Ese correo electrónico ya está registrado.";
        break;

      case "auth/invalid-email":
        mensaje.textContent =
          "El correo electrónico no es válido.";
        break;

      case "auth/weak-password":
        mensaje.textContent =
          "La contraseña debe tener al menos 6 caracteres.";
        break;

      case "auth/operation-not-allowed":
        mensaje.textContent =
          "Debés activar Email/Password en Firebase Authentication.";
        break;

      case "permission-denied":
        mensaje.textContent =
          "Firestore no permitió guardar el perfil. Revisá las reglas.";
        break;

      default:
        mensaje.textContent =
          "No se pudo completar el registro: " + error.message;
    }
  }
}