import { obtenerDatos, guardarDatos } from "./config.js";

// ==========================================================
// CARGAR TODA LA INFORMACIÓN
// ==========================================================

export async function cargarBaseDatos() {

    let datos = await obtenerDatos();

    // Si el BIN está vacío, crear la estructura inicial
    if (!datos || Object.keys(datos).length === 0) {

        datos = {

            usuarios: [],

            partidos: [],

            torneos: [],

            canchas: []

        };

        await guardarDatos(datos);

    }

    return datos;

}

// ==========================================================
// GUARDAR TODA LA BASE
// ==========================================================

export async function actualizarBaseDatos(datos) {

    await guardarDatos(datos);

}

// ==========================================================
// USUARIOS
// ==========================================================

export async function obtenerUsuarios() {

    const datos = await cargarBaseDatos();

    return datos.usuarios;

}

export async function guardarUsuario(usuario) {

    const datos = await cargarBaseDatos();

    datos.usuarios.push(usuario);

    await actualizarBaseDatos(datos);

}

export async function buscarUsuarioPorEmail(email) {

    const usuarios = await obtenerUsuarios();

    return usuarios.find(u => u.email === email);

}

// ==========================================================
// PARTIDOS
// ==========================================================

export async function obtenerPartidos() {

    const datos = await cargarBaseDatos();

    return datos.partidos;

}

export async function guardarPartido(partido) {

    const datos = await cargarBaseDatos();

    datos.partidos.push(partido);

    await actualizarBaseDatos(datos);

}

export async function eliminarPartido(id) {

    const datos = await cargarBaseDatos();

    datos.partidos = datos.partidos.filter(

        partido => partido.id !== id

    );

    await actualizarBaseDatos(datos);

}

// ==========================================================
// TORNEOS
// ==========================================================

export async function obtenerTorneos() {

    const datos = await cargarBaseDatos();

    return datos.torneos;

}

export async function guardarTorneo(torneo) {

    const datos = await cargarBaseDatos();

    datos.torneos.push(torneo);

    await actualizarBaseDatos(datos);

}

export async function eliminarTorneo(id) {

    const datos = await cargarBaseDatos();

    datos.torneos = datos.torneos.filter(

        torneo => torneo.id !== id

    );

    await actualizarBaseDatos(datos);

}

// ==========================================================
// CANCHAS
// ==========================================================

export async function obtenerCanchas() {

    const datos = await cargarBaseDatos();

    return datos.canchas;

}

export async function guardarCancha(cancha) {

    const datos = await cargarBaseDatos();

    datos.canchas.push(cancha);

    await actualizarBaseDatos(datos);

}

export async function eliminarCancha(id) {

    const datos = await cargarBaseDatos();

    datos.canchas = datos.canchas.filter(

        cancha => cancha.id !== id

    );

    await actualizarBaseDatos(datos);

}