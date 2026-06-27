import {
    obtenerUsuarioActivo,
    protegerPagina,
    configurarCerrarSesion
} from "./auth.js";

import {
    obtenerPartidos,
    obtenerTorneos
} from "./storage.js";

// ==========================================================
// INICIALIZACIÓN
// ==========================================================

import {
    protegerPagina,
    configurarCerrarSesion
} from "./auth.js";

const usuario = await protegerPagina();

if (!usuario) {
    throw new Error("Usuario no autenticado");
}

configurarCerrarSesion();

console.log("Usuario activo:", usuario);

configurarCerrarSesion();

cargarDashboard();

// ==========================================================
// CARGAR DASHBOARD
// ==========================================================

async function cargarDashboard() {

    document.getElementById("nombreUsuario").textContent = usuario.nombre;

    const partidos = await obtenerPartidos();
    const torneos = await obtenerTorneos();

    const partidosUsuario = partidos.filter(
        partido => partido.email === usuario.email
    );

    const torneosUsuario = torneos.filter(
        torneo => torneo.email === usuario.email
    );

    actualizarTarjetas(partidosUsuario, torneosUsuario);

    cargarActividadReciente(partidosUsuario);

}

// ==========================================================
// TARJETAS RESUMEN
// ==========================================================

function actualizarTarjetas(partidos, torneos) {

    const totalPartidos = partidos.length;

    const totalGoles = partidos.reduce(
        (total, partido) => total + Number(partido.goles),
        0
    );

    const totalAsistencias = partidos.reduce(
        (total, partido) => total + Number(partido.asistencias),
        0
    );

    document.getElementById("totalPartidos").textContent = totalPartidos;

    document.getElementById("totalGoles").textContent = totalGoles;

    document.getElementById("totalAsistencias").textContent = totalAsistencias;

    document.getElementById("totalTorneos").textContent = torneos.length;

}

// ==========================================================
// ACTIVIDAD RECIENTE
// ==========================================================

function cargarActividadReciente(partidos) {

    const tabla = document.getElementById("tablaActividad");

    tabla.innerHTML = "";

    const recientes = [...partidos]
        .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
        .slice(0, 5);

    recientes.forEach(partido => {

        const fila = document.createElement("tr");

        fila.innerHTML = `
            <td>${partido.fecha}</td>
            <td>${partido.rival}</td>
            <td>${partido.resultado}</td>
            <td>${partido.goles}</td>
        `;

        tabla.appendChild(fila);

    });

}