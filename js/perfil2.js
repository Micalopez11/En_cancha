import {
    protegerPagina,
    configurarCerrarSesion
} from "./auth.js";

import {
    cargarBaseDatos,
    actualizarBaseDatos,
    obtenerPartidos,
    obtenerTorneos
} from "./storage.js";

// ==========================================================
// INICIALIZACIÓN
// ==========================================================

const usuario = protegerPagina();

configurarCerrarSesion();

cargarPerfil();

// ==========================================================
// CARGAR PERFIL
// ==========================================================

async function cargarPerfil() {

    document.getElementById("nombreUsuario").textContent = usuario.nombre;
    document.getElementById("equipoActual").textContent = usuario.equipo || "Sin equipo registrado";

    document.getElementById("nombre").value = usuario.nombre || "";
    document.getElementById("email").value = usuario.email || "";
    document.getElementById("edad").value = usuario.edad || "";
    document.getElementById("altura").value = usuario.altura || "";
    document.getElementById("peso").value = usuario.peso || "";
    document.getElementById("posicion").value = usuario.posicion || "Volante";
    document.getElementById("pierna").value = usuario.pierna || "Derecha";
    document.getElementById("equipo").value = usuario.equipo || "";
    document.getElementById("provincia").value = usuario.provincia || "";
    document.getElementById("ciudad").value = usuario.ciudad || "";
    document.getElementById("bio").value = usuario.bio || "";

    document.getElementById("fotoPerfil").src =
        usuario.foto || "assets/img/default-profile.png";

    await cargarResumenDeportivo();

}

// ==========================================================
// ACTUALIZAR PERFIL
// ==========================================================

const perfilForm = document.getElementById("perfilForm");

perfilForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const datos = await cargarBaseDatos();

    const indiceUsuario = datos.usuarios.findIndex(
        u => u.email === usuario.email
    );

    if (indiceUsuario === -1) {
        alert("No se encontró el usuario");
        return;
    }

    const usuarioActualizado = {
        ...datos.usuarios[indiceUsuario],
        nombre: document.getElementById("nombre").value,
        edad: document.getElementById("edad").value,
        altura: document.getElementById("altura").value,
        peso: document.getElementById("peso").value,
        posicion: document.getElementById("posicion").value,
        pierna: document.getElementById("pierna").value,
        equipo: document.getElementById("equipo").value,
        provincia: document.getElementById("provincia").value,
        ciudad: document.getElementById("ciudad").value,
        bio: document.getElementById("bio").value
    };

    const archivoFoto = document.getElementById("foto").files[0];

    if (archivoFoto) {
        usuarioActualizado.foto = await convertirImagenABase64(archivoFoto);
    }

    datos.usuarios[indiceUsuario] = usuarioActualizado;

    await actualizarBaseDatos(datos);

    sessionStorage.setItem(
        "usuarioActivo",
        JSON.stringify(usuarioActualizado)
    );

    alert("Perfil actualizado correctamente");

    window.location.reload();
});

// ==========================================================
// RESUMEN DEPORTIVO
// ==========================================================

async function cargarResumenDeportivo() {

    const partidos = await obtenerPartidos();
    const torneos = await obtenerTorneos();

    const partidosUsuario = partidos.filter(
        partido => partido.email === usuario.email
    );

    const torneosUsuario = torneos.filter(
        torneo => torneo.email === usuario.email
    );

    const totalGoles = partidosUsuario.reduce(
        (total, partido) => total + Number(partido.goles),
        0
    );

    const totalAsistencias = partidosUsuario.reduce(
        (total, partido) => total + Number(partido.asistencias),
        0
    );

    document.getElementById("partidos").textContent = partidosUsuario.length;
    document.getElementById("goles").textContent = totalGoles;
    document.getElementById("asistencias").textContent = totalAsistencias;
    document.getElementById("torneos").textContent = torneosUsuario.length;

}

// ==========================================================
// CONVERTIR IMAGEN A BASE64
// ==========================================================

function convertirImagenABase64(archivo) {

    return new Promise((resolve, reject) => {

        const lector = new FileReader();

        lector.onload = () => resolve(lector.result);

        lector.onerror = error => reject(error);

        lector.readAsDataURL(archivo);

    });

}