import { apiFetch } from "../../accueils/apiService";

const BASE_URL = "/administration";


/* =====================================================
   Récupérer les années académiques
===================================================== */

export async function getAnneesAcademiques() {
  try {
    const response = await apiFetch(
      `${BASE_URL}/annees-academiques-get-all`,
      {
        method: "GET",
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message:
          data.message ||
          "Erreur lors de la récupération des années académiques.",
      };
    }

    return {
      success: true,
      data: data.data || [],
    };
  } catch (error) {
    console.error(
      "❌ getAnneesAcademiques erreur :",
      error
    );

    return {
      success: false,
      message: "Erreur réseau",
    };
  }
} 

 

/* =========================================================
   Récupérer les frais académiques d'une mention
   pour une année académique spécifiée
========================================================= */
export async function getFraisAcademiquesByMention({
  code_mention,
  libelle_annee
}) {
  try {
    // 1. Vérification des paramètres
    if (
      !code_mention ||
      !libelle_annee
    ) {
      return {
        success: false,
        message:
          "Le code de la mention et l'année académique sont obligatoires.",
        data: []
      };
    }

    // 2. Appel du backend
    const res = await apiFetch(
      `${BASE_URL}/liste-frais-academiques/get-by-mention`,
      {
        method: "POST",
        body: JSON.stringify({
          code_mention,
          libelle_annee
        })
      }
    );

    // 3. Lecture de la réponse
    const data = await res.json();

    // 4. Vérification du résultat
    if (!res.ok || !data.success) {
      return {
        success: false,
        message:
          data.message ||
          "Erreur lors de la récupération des frais académiques.",
        data: []
      };
    }

    // 5. Retour des données
    return {
      success: true,
      message: data.message,
      annee_academique: data.annee_academique,
      data: Array.isArray(data.data)
        ? data.data
        : []
    };

    

  } catch (error) {
    console.error(
      "Erreur getFraisAcademiquesByMention :",
      error
    );

    return {
      success: false,
      message:
        "Erreur réseau lors de la récupération des frais académiques.",
      data: []
    };
  }
}





