import { supabase } from "./config.js";

const registroForm = document.getElementById("registroForm");
const mensajeRegistro = document.getElementById("mensajeRegistro");

registroForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const nombre = document.getElementById("nombre").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
            data: {
                nombre: nombre
            }
        }
    });

    if (error) {
        console.error("Error en registro:", error);
        mensajeRegistro.textContent = error.message;
        mensajeRegistro.className = "mensaje-error";
        return;
    }

    console.log("Usuario creado:", data);

    mensajeRegistro.textContent = "Registro exitoso. Revisá Supabase Authentication.";
    mensajeRegistro.className = "mensaje-exito";
});