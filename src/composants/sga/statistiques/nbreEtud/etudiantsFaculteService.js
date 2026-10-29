import { apiFetch } from "../../../accueils/apiService";

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


/* =====================================================
   Récupérer les statistiques des effectifs
===================================================== */

export async function getStatistiquesEffectifs({
  anneeId,
}) {
  try {
    if (!anneeId) {
      return {
        success: false,
        message:
          "L'ID de l'année académique est requis.",
      };
    }

    const response = await apiFetch(
      `${BASE_URL}/statistiques-effectifs-etablissement`,
      {
        method: "POST",
        body: JSON.stringify({
          anneeId,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message:
          data.message ||
          "Erreur lors de la récupération des effectifs.",
      };
    }

    return {
      success: true,
      data: data.data,
    };
  } catch (error) {
    console.error(
      "❌ getStatistiquesEffectifs erreur :",
      error
    );

    return {
      success: false,
      message: "Erreur réseau",
    };
  }
}

