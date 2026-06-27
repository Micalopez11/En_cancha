// ==========================================================
// CONFIGURACIÓN DE SUPABASE
// ==========================================================

// Reemplazar con los datos de tu proyecto Supabase

const SUPABASE_URL = "https://vgstjsdbffdbhmobaqtu.supabase.co";

const SUPABASE_ANON_KEY = "sb_publishable_rtL_EUaapF_JKl_-DgL_Wg_wuHy8gbp";

// ==========================================================
// CREAR CLIENTE DE SUPABASE
// ==========================================================

export const supabase = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);