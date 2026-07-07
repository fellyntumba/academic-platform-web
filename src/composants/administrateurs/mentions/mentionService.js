import { apiFetch } from "../apiService"; // ton utilitaire fetch

const BASE_URL = "/administration";

/* =========================
   Créer un code_mention
========================= */
export async function creerMention({code_mention, code_faculte}) {
  try {
    const res = await apiFetch(`${BASE_URL}/code-mention/create`, {
      method: "POST",
      body: JSON.stringify({ code_mention, code_faculte }),
    });
    const data = await res.json();
    if (!res.ok) return { success: false, message: data.message || "Erreur création mention" };
    return { success: true, message: data.message || "Mention créée avec succès" };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Erreur réseau" };
  }
}

/* =========================
   Modifier un code_mention
========================= */
export async function modifierMention({ancien_code, nouveau_code}) {
  try {
    const res = await apiFetch(`${BASE_URL}/code-mention/update`, {
      method: "PUT",
      body: JSON.stringify({ ancien_code, nouveau_code }),
    });
    const data = await res.json();
    if (!res.ok) return { success: false, message: data.message || "Erreur modification mention" };
    return { success: true, message: data.message || "Mention modifiée avec succès" };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Erreur réseau" };
  }
}

/* =========================
   Récupérer tous les code_mentions
========================= */
export async function getMentions({code_faculte}) {
  try {
    const res = await apiFetch(`${BASE_URL}/code-mention/get`, { 
      method: "POST",
      body: JSON.stringify({ code_faculte}),
    });
    const data = await res.json();
    if (!res.ok) return { success: false, message: data.message || "Erreur récupération mentions" };
    return { success: true, data };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Erreur réseau" };
  }
}
