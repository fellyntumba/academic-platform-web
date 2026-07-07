import { apiFetch } from "../apiService"; // ton utilitaire fetch

const BASE_URL = "/administration";


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

// Récupérer les niveaux
export const getNiveauxParCodeParcours = async ({code_parcours}) => {
  try {
    const response = await apiFetch(`${BASE_URL}/niveaux-promo/get`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code_parcours })
    });

    const data = await response.json();
    return data; // { success, message, data: [...] }
  } catch (error) {
    console.error("Erreur lors de la récupération des niveaux :", error);
    return {
      success: false,
      message: "Erreur lors de la récupération des niveaux",
      data: []
    };
  }
};

/* =========================
   Créer une version de promotion
========================= */
export const createPromotionVersionService = async ({ code_parcours, niveau, nom_promotion_version }) => {
  try {
    const response = await apiFetch(`${BASE_URL}/promo-version/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code_parcours, niveau, nom_promotion_version })
    });

    const data = await response.json();
    return data; // { success, message, id_version }
  } catch (error) {
    console.error("Erreur lors de la création de la version de promotion :", error);
    return {
      success: false,
      message: "Erreur réseau lors de la création de la version de promotion"
    };
  }
};


/* =========================
   Récupérer les promotions versions pour annee en cours
========================= */
export const getPromotionVersionByCodeService = async ({ code_parcours }) => {
  try {

    const response = await apiFetch(`${BASE_URL}/promo-version/get`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code_parcours })
    });

    const data = await response.json();

    return data; // { success, message, data }

  } catch (error) {

    console.error("Erreur récupération promotions versions :", error);

    return {
      success: false,
      message: "Erreur réseau lors de la récupération des promotions",
      data: []
    };
  }
};


/* =========================
   Récupérer les promotions versions pour annee passee
========================= */
export const getPromotionVersionByCodeAnneePasseeService = async ({ code_parcours }) => {
  try {

    const response = await apiFetch(`${BASE_URL}/promo-version/code-parcours/annee-passee`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code_parcours })
    });

    const data = await response.json();

    return data; // { success, message, data }

  } catch (error) {

    console.error("Erreur récupération promotions versions :", error);

    return {
      success: false,
      message: "Erreur réseau lors de la récupération des promotions",
      data: []
    };
  }
};


/* =========================
   Modifier une promotion version
========================= */
export const updatePromotionVersionNameService = async ({
  ancien_nom_promotion,
  nouveau_nom_promotion
}) => {

  try {

    const response = await apiFetch(`${BASE_URL}/promo-version/modify`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ancien_nom_promotion,
        nouveau_nom_promotion
      })
    });

    const data = await response.json();

    return data; // { success, message }

  } catch (error) {

    console.error("Erreur modification promotion version :", error);

    return {
      success: false,
      message: "Erreur réseau lors de la modification de la promotion"
    };
  }
};