import { apiFetch } from "../apiService"; // ton utilitaire fetch

const BASE_URL = "/administration";

/* =========================
   Créer un niveau-promotion 
========================= */
export async function creerNiveauPromotion({code_parcours, niveau }) {
  try {
    const res = await apiFetch(`${BASE_URL}/niveau-promo/create`, {
      method: "POST",
      body: JSON.stringify({ code_parcours, niveau }),
    });
    const data = await res.json();
    if (!res.ok) return { success: false, message: data.message || "Erreur création niveau" };
    return { success: true, message: data.message || "Niveau créée avec succès" };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Erreur réseau" };
  }
}

/* =========================
   Récupérer les code_parcours
========================= */
export async function getParcours({code_mention}) {
  try {
    const res = await apiFetch(`${BASE_URL}/code-parcours/get`, { 
      method: "POST",
      body: JSON.stringify({ code_mention}),
    });
    const data = await res.json();
    if (!res.ok) return { success: false, message: data.message || "Erreur récupération parcours" };
    return { success: true, data };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Erreur réseau" };
  }
}