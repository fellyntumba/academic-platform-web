import { apiFetch } from "../../accueils/apiService";

const BASE_URL = "/administration";

/* =========================
   Récupérer les affectations des cours d'une mention
========================= */
export async function getAffectationsCoursByMention({code_mention}) {
  try {

    const res = await apiFetch(
      `${BASE_URL}/list-cours-enseign-by-mention/get`,
      {
        method: "POST",
        body: JSON.stringify({
          code_mention,
        }),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      return {
        success: false,
        message:
          data.message ||
          "Erreur lors de la récupération des affectations.",
        data: [],
      };
    }

    return {
        success: true,
        annee_academique: data.annee_academique,
        data: data.data
    };

  } catch (error) {

    console.error(error);

    return {
      success: false,
      message: "Erreur réseau",
      data: [],
    };

  }
}