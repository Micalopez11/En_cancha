import {
    protegerPagina,
    configurarCerrarSesion
} from "./auth.js";

import {
    obtenerPartidos
} from "./storage.js";

const usuario = protegerPagina();

configurarCerrarSesion();

cargarEstadisticas();

async function cargarEstadisticas() {
    const partidos = await obtenerPartidos();

    const partidosUsuario = partidos.filter(
        partido => partido.email === usuario.email
    );

    const totalPartidos = partidosUsuario.length;

    const totalGoles = partidosUsuario.reduce(
        (total, partido) => total + Number(partido.goles),
        0
    );

    const totalAsistencias = partidosUsuario.reduce(
        (total, partido) => total + Number(partido.asistencias),
        0
    );

    const totalMinutos = partidosUsuario.reduce(
        (total, partido) => total + Number(partido.minutos),
        0
    );

    const victorias = partidosUsuario.filter(p => p.resultado === "Victoria").length;
    const empates = partidosUsuario.filter(p => p.resultado === "Empate").length;
    const derrotas = partidosUsuario.filter(p => p.resultado === "Derrota").length;

    document.getElementById("cantidadPartidos").textContent = totalPartidos;
    document.getElementById("cantidadGoles").textContent = totalGoles;
    document.getElementById("cantidadAsistencias").textContent = totalAsistencias;
    document.getElementById("cantidadMinutos").textContent = totalMinutos;

    document.getElementById("victorias").textContent = victorias;
    document.getElementById("empates").textContent = empates;
    document.getElementById("derrotas").textContent = derrotas;

    document.getElementById("promedioGoles").textContent =
        totalPartidos > 0 ? (totalGoles / totalPartidos).toFixed(2) : 0;

    document.getElementById("promedioPartido").textContent =
        totalPartidos > 0 ? (totalGoles / totalPartidos).toFixed(2) : 0;

    document.getElementById("promedioAsistencias").textContent =
        totalPartidos > 0 ? (totalAsistencias / totalPartidos).toFixed(2) : 0;

    document.getElementById("promedioMinutos").textContent =
        totalPartidos > 0 ? (totalMinutos / totalPartidos).toFixed(2) : 0;

    document.getElementById("porcentajeVictorias").textContent =
        totalPartidos > 0 ? ((victorias / totalPartidos) * 100).toFixed(1) + "%" : "0%";

    document.getElementById("porcentajeDerrotas").textContent =
        totalPartidos > 0 ? ((derrotas / totalPartidos) * 100).toFixed(1) + "%" : "0%";

    document.getElementById("porcentajeEmpates").textContent =
        totalPartidos > 0 ? ((empates / totalPartidos) * 100).toFixed(1) + "%" : "0%";

    crearGraficos(partidosUsuario, victorias, empates, derrotas);
}

function crearGraficos(partidos, victorias, empates, derrotas) {
    crearGraficoResultados(victorias, empates, derrotas);
    crearGraficoGolesMes(partidos);
    crearGraficoPosiciones(partidos);
    crearGraficoMinutosMes(partidos);
}

function crearGraficoResultados(victorias, empates, derrotas) {
    new Chart(document.getElementById("graficoResultados"), {
        type: "doughnut",
        data: {
            labels: ["Victorias", "Empates", "Derrotas"],
            datasets: [{
                data: [victorias, empates, derrotas]
            }]
        }
    });
}

function crearGraficoGolesMes(partidos) {
    const datosMes = agruparPorMes(partidos, "goles");

    new Chart(document.getElementById("graficoGolesMes"), {
        type: "bar",
        data: {
            labels: Object.keys(datosMes),
            datasets: [{
                label: "Goles",
                data: Object.values(datosMes)
            }]
        }
    });
}

function crearGraficoPosiciones(partidos) {
    const posiciones = {};

    partidos.forEach(partido => {
        posiciones[partido.posicion] = (posiciones[partido.posicion] || 0) + 1;
    });

    new Chart(document.getElementById("graficoPosiciones"), {
        type: "pie",
        data: {
            labels: Object.keys(posiciones),
            datasets: [{
                data: Object.values(posiciones)
            }]
        }
    });
}

function crearGraficoMinutosMes(partidos) {
    const datosMes = agruparPorMes(partidos, "minutos");

    new Chart(document.getElementById("graficoMinutos"), {
        type: "line",
        data: {
            labels: Object.keys(datosMes),
            datasets: [{
                label: "Minutos jugados",
                data: Object.values(datosMes)
            }]
        }
    });
}

function agruparPorMes(partidos, campo) {
    const meses = {};

    partidos.forEach(partido => {
        if (!partido.fecha) return;

        const fecha = new Date(partido.fecha);

        const mes = fecha.toLocaleString("es-AR", {
            month: "short",
            year: "numeric"
        });

        meses[mes] = (meses[mes] || 0) + Number(partido[campo]);
    });

    return meses;
}