import {
    protegerPagina,
    configurarCerrarSesion
} from "./auth.js";

import {
    obtenerPartidos,
    guardarPartido,
    eliminarPartido
} from "./storage.js";

const usuario = protegerPagina();

configurarCerrarSesion();

const partidoForm = document.getElementById("partidoForm");
const tablaPartidos = document.getElementById("tablaPartidos");

cargarPartidos();

partidoForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const partido = {
        id: crypto.randomUUID(),
        email: usuario.email,
        fecha: document.getElementById("fecha").value,
        torneo: document.getElementById("torneo").value,
        equipo: document.getElementById("equipo").value,
        rival: document.getElementById("rival").value,
        resultado: document.getElementById("resultado").value,
        marcador: document.getElementById("marcador").value,
        goles: Number(document.getElementById("goles").value),
        asistencias: Number(document.getElementById("asistencias").value),
        minutos: Number(document.getElementById("minutos").value),
        posicion: document.getElementById("posicion").value,
        cancha: document.getElementById("cancha").value,
        ciudad: document.getElementById("ciudad").value,
        observaciones: document.getElementById("observaciones").value
    };

    await guardarPartido(partido);

    partidoForm.reset();

    cargarPartidos();
});

async function cargarPartidos() {
    const partidos = await obtenerPartidos();

    const partidosUsuario = partidos.filter(
        partido => partido.email === usuario.email
    );

    tablaPartidos.innerHTML = "";

    partidosUsuario.forEach(partido => {
        const fila = document.createElement("tr");

        fila.innerHTML = `
            <td>${partido.fecha}</td>
            <td>${partido.rival}</td>
            <td>${partido.torneo}</td>
            <td>${partido.resultado}</td>
            <td>${partido.marcador}</td>
            <td>${partido.goles}</td>
            <td>${partido.asistencias}</td>
            <td>
                <button class="btn-eliminar" data-id="${partido.id}">
                    Eliminar
                </button>
            </td>
        `;

        tablaPartidos.appendChild(fila);
    });

    activarBotonesEliminar();
}

function activarBotonesEliminar() {
    const botones = document.querySelectorAll(".btn-eliminar");

    botones.forEach(boton => {
        boton.addEventListener("click", async function () {
            const id = this.dataset.id;

            await eliminarPartido(id);

            cargarPartidos();
        });
    });
}