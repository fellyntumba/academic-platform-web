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
   Récupérer les affectations des cours d'une mention
   pour une année académique spécifiée
========================================================= */
export async function getAffectationsCoursByMention({
  code_mention,
  libelle_annee
}) {
  try {
    const res = await apiFetch(
      `${BASE_URL}/list-cours-enseign-by-mention/get`,
      {
        method: "POST",
        body: JSON.stringify({
          code_mention,
          libelle_annee
        })
      }
    );

    const data = await res.json();

    if (!res.ok || !data.success) {
      return {
        success: false,
        message:
          data.message ||
          "Erreur lors de la récupération des affectations.",
        data: []
      };
    }

    return {
      success: true,
      message: data.message,
      annee_academique: data.annee_academique,
      data: data.data || []
    };

  } catch (error) {
    console.error(
      "Erreur getAffectationsCoursByMention :",
      error
    );

    return {
      success: false,
      message: "Erreur réseau lors de la récupération des affectations.",
      data: []
    };
  }
}


