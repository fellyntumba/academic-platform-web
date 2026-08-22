import { apiFetch } from "../../accueils/apiService"; // ton utilitaire fetch

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


// Récupérer les niveaux d'un parcours configurés pour une université
export const getNiveauxParcoursConfig = async ({code_parcours}) => {
  try {
    const response = await apiFetch("/administration/university-config/niveaux-parcours/get",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code_parcours,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message ||
        data.error ||
        "Erreur lors de la récupération des niveaux du parcours."
      );
    }

    return data.data || [];
  } catch (error) {
    console.error(
      "Erreur getNiveauxParcoursConfig :",
      error
    );

    throw error;
  }
};

