import {
    protegerPagina,
    configurarCerrarSesion
} from "./auth.js";

import {
    obtenerTorneos,
    guardarTorneo,
    eliminarTorneo
} from "./storage.js";

const usuario = protegerPagina();

configurarCerrarSesion();

const torneoForm = document.getElementById("torneoForm");
const tablaTorneos = document.getElementById("tablaTorneos");

cargarTorneos();

torneoForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const torneo = {
        id: crypto.randomUUID(),
        email: usuario.email,
        nombre: document.getElementById("nombreTorneo").value,
        equipo: document.getElementById("equipoTorneo").value,
        categoria: document.getElementById("categoriaTorneo").value,
        fechaInicio: document.getElementById("fechaInicio").value,
        fechaFin: document.getElementById("fechaFin").value,
        estado: document.getElementById("estadoTorneo").value,
        partidos: Number(document.getElementById("partidosTorneo").value),
        goles: Number(document.getElementById("golesTorneo").value),
        asistencias: Number(document.getElementById("asistenciasTorneo").value),
        posicionFinal: document.getElementById("posicionFinal").value,
        logros: document.getElementById("logrosTorneo").value
    };

    await guardarTorneo(torneo);

    torneoForm.reset();

    cargarTorneos();
});

async function cargarTorneos() {
    const torneos = await obtenerTorneos();

    const torneosUsuario = torneos.filter(
        torneo => torneo.email === usuario.email
    );

    tablaTorneos.innerHTML = "";

    torneosUsuario.forEach(torneo => {
        const fila = document.createElement("tr");

        fila.innerHTML = `
            <td>${torneo.nombre}</td>
            <td>${torneo.equipo}</td>
            <td>${torneo.categoria}</td>
            <td>${torneo.estado}</td>
            <td>${torneo.partidos}</td>
            <td>${torneo.goles}</td>
            <td>${torneo.posicionFinal}</td>
            <td>
                <button class="btn-eliminar" data-id="${torneo.id}">
                    Eliminar
                </button>
            </td>
        `;

        tablaTorneos.appendChild(fila);
    });

    activarBotonesEliminar();
}

function activarBotonesEliminar() {
    const botones = document.querySelectorAll(".btn-eliminar");

    botones.forEach(boton => {
        boton.addEventListener("click", async function () {
            const id = this.dataset.id;

            await eliminarTorneo(id);

            cargarTorneos();
        });
    });
}