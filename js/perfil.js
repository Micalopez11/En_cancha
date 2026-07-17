// js/perfil.js

import { auth, db } from "./firebase.js";

import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js";

import {
    doc,
    getDoc,
    setDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

//import {
 //   obtenerPartidos,
 //   obtenerTorneos
//} from "./storage.js";

// ==========================================================
// VARIABLES GENERALES
// ==========================================================

let usuarioFirebase = null;
let datosJugadora = null;

const perfilForm = document.getElementById("perfilForm");
const botonCerrarSesion = document.getElementById("cerrarSesion");

// ==========================================================
// INICIALIZACIÓN Y PROTECCIÓN DE LA PÁGINA
// ==========================================================

onAuthStateChanged(auth, async (usuario) => {

    // Si no hay una sesión activa, vuelve al login
    if (!usuario) {
        window.location.href = "./login.html";
        return;
    }

    usuarioFirebase = usuario;

    await cargarPerfil();
});

// ==========================================================
// CARGAR PERFIL DESDE FIRESTORE
// ==========================================================

async function cargarPerfil() {

    try {
        const referenciaJugadora = doc(
            db,
            "jugadoras",
            usuarioFirebase.uid
        );

        const documentoJugadora = await getDoc(referenciaJugadora);

        console.log("UID autenticado:", usuarioFirebase.uid);

        console.log("Existe documento:", documentoJugadora.exists());

        console.log("Datos:", documentoJugadora.data());

        if (!documentoJugadora.exists()) {
            alert("No se encontró el perfil de la jugadora en Firebase.");
            return;
        }

        datosJugadora = documentoJugadora.data();


        console.log("Nombre:", datosJugadora.nombre);
        console.log("Equipo:", datosJugadora.equipo);
        console.log("Posición:", datosJugadora.posicion);

        // Encabezado del perfil
        asignarTexto(
            "nombreUsuario",
            datosJugadora.nombre || "Jugadora"
        );

        asignarTexto(
            "equipoActual",
            datosJugadora.equipo || "Sin equipo registrado"
        );

        // Datos principales
        asignarValor("nombre", datosJugadora.nombre);
        asignarValor(
            "email",
            datosJugadora.email || usuarioFirebase.email
        );
        asignarValor("edad", datosJugadora.edad);
        asignarValor("altura", datosJugadora.altura);
        asignarValor("peso", datosJugadora.peso);
        asignarValor("posicion", datosJugadora.posicion);
        asignarValor("pierna", datosJugadora.pierna);
        asignarValor("equipo", datosJugadora.equipo);
        asignarValor("provincia", datosJugadora.provincia);
        asignarValor("ciudad", datosJugadora.ciudad);
        asignarValor("bio", datosJugadora.bio);

        // Foto del perfil
        const fotoPerfil = document.getElementById("fotoPerfil");

        if (fotoPerfil) {
            fotoPerfil.src =
                datosJugadora.foto ||
                "./assets/img/default-profile.png";
        }

        await cargarResumenDeportivo();

    } catch (error) {
        console.error("Error al cargar el perfil:", error);
        alert("No se pudieron cargar los datos del perfil.");
    }
}

// ==========================================================
// ACTUALIZAR PERFIL EN FIRESTORE
// ==========================================================

if (perfilForm) {

    perfilForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        if (!usuarioFirebase) {
            alert("No hay una sesión activa.");
            return;
        }

        const botonGuardar = perfilForm.querySelector(
            'button[type="submit"]'
        );

        if (botonGuardar) {
            botonGuardar.disabled = true;
            botonGuardar.textContent = "Guardando...";
        }

        try {
            const usuarioActualizado = {
                uid: usuarioFirebase.uid,

                nombre: obtenerValor("nombre"),

                // El correo se mantiene desde Authentication
                email:
                    obtenerValor("email") ||
                    usuarioFirebase.email,

                edad: obtenerNumeroONull("edad"),
                altura: obtenerNumeroONull("altura"),
                peso: obtenerNumeroONull("peso"),

                posicion: obtenerValor("posicion"),
                pierna: obtenerValor("pierna"),
                equipo: obtenerValor("equipo"),
                provincia: obtenerValor("provincia"),
                ciudad: obtenerValor("ciudad"),
                bio: obtenerValor("bio"),

                ultimaActualizacion: serverTimestamp()
            };

            // Procesar foto, si se eligió una
            const inputFoto = document.getElementById("foto");
            const archivoFoto = inputFoto?.files?.[0];

            if (archivoFoto) {

                // Evita imágenes demasiado grandes en Firestore
                if (archivoFoto.size > 700000) {
                    alert(
                        "La imagen es demasiado grande. Elegí una imagen menor a 700 KB."
                    );

                    return;
                }

                usuarioActualizado.foto =
                    await convertirImagenABase64(archivoFoto);
            }

            const referenciaJugadora = doc(
                db,
                "jugadoras",
                usuarioFirebase.uid
            );

            /*
             * merge: true actualiza los campos existentes
             * sin eliminar fechaRegistro u otros datos.
             */
            await setDoc(
                referenciaJugadora,
                usuarioActualizado,
                { merge: true }
            );

            datosJugadora = {
                ...datosJugadora,
                ...usuarioActualizado
            };

            alert("Perfil actualizado correctamente.");

            window.location.reload();

        } catch (error) {
            console.error("Error al actualizar el perfil:", error);

            if (
                error.code === "permission-denied" ||
                error.code === "firestore/permission-denied"
            ) {
                alert(
                    "Firebase no permitió actualizar el perfil. Revisá las reglas de Firestore."
                );
            } else {
                alert("No se pudo actualizar el perfil.");
            }

        } finally {

            if (botonGuardar) {
                botonGuardar.disabled = false;
                botonGuardar.textContent = "Guardar cambios";
            }
        }
    });
}

// ==========================================================
// CERRAR SESIÓN
// ==========================================================

if (botonCerrarSesion) {

    botonCerrarSesion.addEventListener("click", async function () {

        try {
            await signOut(auth);

            window.location.href = "./login.html";

        } catch (error) {
            console.error("Error al cerrar sesión:", error);
            alert("No se pudo cerrar la sesión.");
        }
    });
}

// ==========================================================
// RESUMEN DEPORTIVO
// ==========================================================

async function cargarResumenDeportivo() {

    try {
        const partidos = await obtenerPartidos();
        const torneos = await obtenerTorneos();

        /*
         * Por ahora se filtra por email porque tus partidos
         * y torneos anteriores se guardaban de esa manera.
         */
        const partidosUsuario = partidos.filter(
            partido =>
                partido.email ===
                (
                    datosJugadora.email ||
                    usuarioFirebase.email
                )
        );

        const torneosUsuario = torneos.filter(
            torneo =>
                torneo.email ===
                (
                    datosJugadora.email ||
                    usuarioFirebase.email
                )
        );

        const totalGoles = partidosUsuario.reduce(
            (total, partido) =>
                total + (Number(partido.goles) || 0),
            0
        );

        const totalAsistencias = partidosUsuario.reduce(
            (total, partido) =>
                total + (Number(partido.asistencias) || 0),
            0
        );

        asignarTexto(
            "partidos",
            partidosUsuario.length
        );

        asignarTexto(
            "goles",
            totalGoles
        );

        asignarTexto(
            "asistencias",
            totalAsistencias
        );

        asignarTexto(
            "torneos",
            torneosUsuario.length
        );

    } catch (error) {
        console.error(
            "Error al cargar el resumen deportivo:",
            error
        );

        asignarTexto("partidos", 0);
        asignarTexto("goles", 0);
        asignarTexto("asistencias", 0);
        asignarTexto("torneos", 0);
    }
}

// ==========================================================
// FUNCIONES AUXILIARES
// ==========================================================

function asignarValor(id, valor) {

    const elemento = document.getElementById(id);

    if (!elemento) {
        return;
    }

    elemento.value =
        valor !== undefined &&
        valor !== null
            ? valor
            : "";
}

function asignarTexto(id, valor) {

    const elemento = document.getElementById(id);

    if (!elemento) {
        return;
    }

    elemento.textContent =
        valor !== undefined &&
        valor !== null
            ? valor
            : "";
}

function obtenerValor(id) {

    const elemento = document.getElementById(id);

    if (!elemento) {
        return "";
    }

    return elemento.value.trim();
}

function obtenerNumeroONull(id) {

    const valor = obtenerValor(id);

    if (valor === "") {
        return null;
    }

    const numero = Number(valor);

    return Number.isNaN(numero)
        ? null
        : numero;
}

// ==========================================================
// CONVERTIR IMAGEN A BASE64
// ==========================================================

function convertirImagenABase64(archivo) {

    return new Promise((resolve, reject) => {

        const lector = new FileReader();

        lector.onload = () => resolve(lector.result);

        lector.onerror = () => {
            reject(
                new Error(
                    "No se pudo procesar la imagen seleccionada."
                )
            );
        };

        lector.readAsDataURL(archivo);
    });
}