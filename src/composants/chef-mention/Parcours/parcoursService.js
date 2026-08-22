import { apiFetch } from "../../accueils/apiService"; // ton utilitaire fetch

const BASE_URL = "/administration";

/* =========================
   Créer un code_parcours
========================= */
export async function creerParcours({code_parcours, code_mention}) {
  try {
    const res = await apiFetch(`${BASE_URL}/code-parcours/create`, {
      method: "POST",
      body: JSON.stringify({ code_parcours, code_mention }),
    });
    const data = await res.json();
    if (!res.ok) return { success: false, message: data.message || "Erreur création parcours" };
    return { success: true, message: data.message || "Parcours créé avec succès" };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Erreur réseau" };
  }
}

/* ========================= 
   Modifier un code_parcours
========================= */
export async function modifierParcours({ancien_code, nouveau_code}) {
  try {
    const res = await apiFetch(`${BASE_URL}/code-parcours/update`, {
      method: "PUT",
      body: JSON.stringify({ ancien_code, nouveau_code }),
    });
    const data = await res.json();
    if (!res.ok) return { success: false, message: data.message || "Erreur modification parcours" };
    return { success: true, message: data.message || "Parcours modifié avec succès" };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Erreur réseau" };
  }
}

/* =========================
   Récupérer tous les code_parcours
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



// Récupérer les code_parcours configurés pour une université
export const getCodeParcoursConfig = async ({code_mention}) => {
  try {
    const response = await apiFetch("/administration/university-config/code-parcours/get",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code_mention,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message ||
        data.error ||
        "Erreur lors de la récupération des mentions."
      );
    }

    return data.data || [];
  } catch (error) {
    console.error(
      "Erreur getCodeParcoursConfig :",
      error
    );

    throw error;
  }
};
