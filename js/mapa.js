import {
    protegerPagina,
    configurarCerrarSesion
} from "./auth.js";

import {
    obtenerCanchas,
    guardarCancha,
    eliminarCancha
} from "./storage.js";

const usuario = protegerPagina();

configurarCerrarSesion();

const canchaForm = document.getElementById("canchaForm");
const tablaCanchas = document.getElementById("tablaCanchas");

let mapa;
let marcadores = [];

iniciarMapa();
cargarCanchas();

canchaForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const cancha = {
        id: crypto.randomUUID(),
        email: usuario.email,
        nombre: document.getElementById("nombreCancha").value,
        ciudad: document.getElementById("ciudadCancha").value,
        direccion: document.getElementById("direccionCancha").value,
        latitud: Number(document.getElementById("latitud").value),
        longitud: Number(document.getElementById("longitud").value)
    };

    await guardarCancha(cancha);

    canchaForm.reset();

    cargarCanchas();
});

function iniciarMapa() {
    mapa = L.map("mapa").setView([-34.7600, -58.4000], 11);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap"
    }).addTo(mapa);
}

async function cargarCanchas() {
    const canchas = await obtenerCanchas();

    const canchasUsuario = canchas.filter(
        cancha => cancha.email === usuario.email
    );

    tablaCanchas.innerHTML = "";

    limpiarMarcadores();

    canchasUsuario.forEach(cancha => {
        agregarFilaCancha(cancha);

        if (cancha.latitud && cancha.longitud) {
            agregarMarcador(cancha);
        }
    });

    activarBotonesEliminar();
}

function agregarFilaCancha(cancha) {
    const fila = document.createElement("tr");

    fila.innerHTML = `
        <td>${cancha.nombre}</td>
        <td>${cancha.ciudad}</td>
        <td>${cancha.direccion}</td>
        <td>${cancha.latitud}, ${cancha.longitud}</td>
        <td>
            <button class="btn-eliminar" data-id="${cancha.id}">
                Eliminar
            </button>
        </td>
    `;

    tablaCanchas.appendChild(fila);
}

function agregarMarcador(cancha) {
    const marcador = L.marker([cancha.latitud, cancha.longitud])
        .addTo(mapa)
        .bindPopup(`
            <strong>${cancha.nombre}</strong><br>
            ${cancha.ciudad}<br>
            ${cancha.direccion}
        `);

    marcadores.push(marcador);
}

function limpiarMarcadores() {
    marcadores.forEach(marcador => {
        mapa.removeLayer(marcador);
    });

    marcadores = [];
}

function activarBotonesEliminar() {
    const botones = document.querySelectorAll(".btn-eliminar");

    botones.forEach(boton => {
        boton.addEventListener("click", async function () {
            const id = this.dataset.id;

            await eliminarCancha(id);

            cargarCanchas();
        });
    });
}