import { apiFetch } from "../apiService"; // ton utilitaire fetch

const BASE_URL = "/administration";

/* =====================================================
   🔹 Créer une version de parcours
===================================================== */
export async function creerParcoursVersion({code_parcours, nom_parcours_version}) {
  try {
    const res = await apiFetch(`${BASE_URL}/parcours-version/create`, {
      method: "POST",
      body: JSON.stringify({
        code_parcours,
        nom_parcours_version
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      return {
        success: false,
        message: data.message || "Erreur lors de la création."
      };
    }

    return {
      success: true,
      message: data.message,
      id_version: data.id_version
    };

  } catch (error) {
    console.error("Erreur creerParcoursVersion :", error);
    return { success: false, message: "Erreur réseau." };
  }
}

/* =====================================================
   🔹 Récupérer une version par code_parcours
===================================================== */
export async function getParcoursVersion({ code_parcours }) {
  try {
    const res = await apiFetch(`${BASE_URL}/parcours-version/get`, {
      method: "POST",
      body: JSON.stringify({ code_parcours }),
    });

    const data = await res.json();

    if (!res.ok) {
      return {
        success: false,
        message: data.message || "Erreur lors de la récupération."
      };
    }

    return {
      success: true,
      version: data.version,
      message: data.message
    };

  } catch (error) {
    console.error("Erreur getParcoursVersion :", error);
    return { success: false, message: "Erreur réseau." };
  }
}

/* =====================================================
   🔹 Modifier une version de parcours
===================================================== */
export async function modifierParcoursVersion({ancien_nom, nouveau_nom}) {
  try {
    const res = await apiFetch(`${BASE_URL}/parcours-version/modify`, {
      method: "PUT",
      body: JSON.stringify({
        ancien_nom,
        nouveau_nom
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      return {
        success: false,
        message: data.message || "Erreur lors de la modification."
      };
    }

    return {
      success: true,
      message: data.message
    };

  } catch (error) {
    console.error("Erreur modifierParcoursVersion :", error);
    return { success: false, message: "Erreur réseau." };
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