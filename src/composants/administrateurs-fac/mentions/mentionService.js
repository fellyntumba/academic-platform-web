import { apiFetch } from "../../accueils/apiService"; // ton utilitaire fetch

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
   Récupérer tous les code_mentions par code_faculte
========================= */
export async function getCodeMentionsBDuniv({code_faculte}) {
  try {
    const response = await apiFetch(`${BASE_URL}/code-mention/get`, { 
      method: "POST",
      body: JSON.stringify({ code_faculte}),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || "Erreur lors de la récupération des mentions.",
        data: [],
      };
    }

    return {
      success: true,
      data: data.data || [],
    };

  } catch (error) {
    console.error(
      "Erreur récupération mentions :",
      error

    );

    return {
      success: false, 
      message: "Erreur réseau.",
      data: [],
    };
  }

}


// Récupérer les mentions configurées pour une faculté
export const getCodesMentionsConfig = async ({code_faculte}) => {
  try {
    const response = await apiFetch("/administration/university-config/code-mention/get",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code_faculte,
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
      "Erreur getCodesMentionsConfig :",
      error
    );

    throw error;
  }
};
