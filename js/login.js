import { supabase } from "./config.js";

const loginForm = document.getElementById("loginForm");
const mensajeLogin = document.getElementById("mensajeLogin");

loginForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password
    });

    if (error) {
        console.error("Error al iniciar sesión:", error);
        mensajeLogin.textContent = error.message;
        mensajeLogin.className = "mensaje-error";
        return;
    }

    mensajeLogin.textContent = "Inicio de sesión exitoso";
    mensajeLogin.className = "mensaje-exito";

    window.location.href = "dashboard.html";
});