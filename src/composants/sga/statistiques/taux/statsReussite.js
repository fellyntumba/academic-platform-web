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
   Récupérer les statistiques de réussite / échec
===================================================== */

export async function getStatistiquesReussite({
  anneeId,
}) {
  try {
    const response = await apiFetch(
      `${BASE_URL}/statistiques-reussite-etablissement`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          anneeId: Number(anneeId),
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message:
          data.message ||
          "Erreur lors de la récupération des statistiques de réussite.",
      };
    }

    return {
      success: true,
      data: data.data || null,
    };
  } catch (error) {
    console.error(
      "❌ getStatistiquesReussite erreur :",
      error
    );

    return {
      success: false,
      message: "Erreur réseau",
    };
  }
}

