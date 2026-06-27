// Conexión a Supabase
const supabaseUrl = "TU_SUPABASE_URL";
const supabaseKey = "TU_SUPABASE_KEY";
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

let chart;
let mapa;

// Login / Registro
async function login() {
  alert("Función de login simulada. Aquí iría la autenticación con Supabase Auth.");
}
async function registro() {
  alert("Función de registro simulada. Aquí iría la creación de usuario en Supabase Auth.");
}

// Perfil
async function guardarPerfil() {
  const jugadora = {
    nombre: document.getElementById("nombre").value,
    edad: document.getElementById("edad").value,
    equipo: document.getElementById("equipo").value,
    bio: document.getElementById("bio").value
  };
  await supabase.from("jugadoras").insert(jugadora);
  alert("Perfil guardado en Supabase");
}

// Partidos
async function guardarPartido() {
  const partido = {
    fecha: document.getElementById("fecha").value,
    rival: document.getElementById("rival").value,
    goles: parseInt(document.getElementById("goles").value) || 0,
    asistencias: parseInt(document.getElementById("asistencias").value) || 0,
    minutos: parseInt(document.getElementById("minutos").value) || 0,
    cancha: document.getElementById("cancha").value
  };
  await supabase.from("partidos").insert(partido);
  alert("Partido guardado en Supabase");
  cargarEstadisticas();
  agregarMarcador(partido.cancha);
}

// Estadísticas
async function cargarEstadisticas() {
  const { data: partidos } = await supabase.from("partidos").select("*");
  const total// Conexión a Supabase
const supabaseUrl = "TU_SUPABASE_URL";
const supabaseKey = "TU_SUPABASE_KEY";
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

let chart;
let mapa;

// Login / Registro
async function login() {
  alert("Función de login simulada. Aquí iría la autenticación con Supabase Auth.");
}
async function registro() {
  alert("Función de registro simulada. Aquí iría la creación de usuario en Supabase Auth.");
}

// Perfil
async function guardarPerfil() {
  const jugadora = {
    nombre: document.getElementById("nombre").value,
    edad: document.getElementById("edad").value,
    equipo: document.getElementById("equipo").value,
    bio: document.getElementById("bio").value
  };
  await supabase.from("jugadoras").insert(jugadora);
  alert("Perfil guardado en Supabase");
}

// Partidos
async function guardarPartido() {
  const partido = {
    fecha: document.getElementById("fecha").value,
    rival: document.getElementById("rival").value,
    goles: parseInt(document.getElementById("goles").value) || 0,
    asistencias: parseInt(document.getElementById("asistencias").value) || 0,
    minutos: parseInt(document.getElementById("minutos").value) || 0,
    cancha: document.getElementById("cancha").value
  };
  await supabase.from("partidos").insert(partido);
  alert("Partido guardado en Supabase");
  cargarEstadisticas();
  agregarMarcador(partido.cancha);
}

// Estadísticas
async function cargarEstadisticas() {
  const { data: partidos } = await supabase.from("partidos").select("*");
  const total