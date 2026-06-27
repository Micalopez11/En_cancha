import { supabase } from "./config.js";

export async function protegerPagina() {
    const { data, error } = await supabase.auth.getUser();

    if (error || !data.user) {
        window.location.href = "login.html";
        return null;
    }

    return data.user;
}

export function configurarCerrarSesion() {
    const botonCerrarSesion = document.getElementById("cerrarSesion");

    if (botonCerrarSesion) {
        botonCerrarSesion.addEventListener("click", async () => {
            await supabase.auth.signOut();
            window.location.href = "login.html";
        });
    }
}