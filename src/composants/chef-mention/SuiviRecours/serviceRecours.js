import { apiFetch } from "../../accueils/apiService";

// =============================
// 🔹 RÉCUPÉRER LE SUIVI DES RECOURS
// =============================
export const getSuiviRecoursService = async ({
  promotion_version_id,
  semestre_id,
  session_id,
}) => {

  // 🔒 Validation
  if (!promotion_version_id || !semestre_id || !session_id) {
    throw new Error(
      "Paramètres requis : promotion_version_id, semestre_id, session_id"
    );
  }

  try {
    const response = await apiFetch("/administration/recours/suivi", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        promotion_version_id,
        semestre_id,
        session_id,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.message || "Erreur lors de la récupération du suivi des recours"
      );
    }

    // 🔥 On retourne directement les données utiles
    return result.data;

  } catch (error) {
    console.error("Erreur getSuiviRecoursService :", error);
    throw error;
  }
};


// =============================
// CHARGER PROMOTIONS PAR MENTION
// =============================
export const getPromotionsService = async ({code_mention}) => {

  const response = await apiFetch("/administration/promotions/get", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      code_mention
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Erreur lors du chargement des promotions");
  }

  return data;
};  

// =============================
// CHARGER SEMESTRES PAR PROMOTION
// =============================
export const getSemestresService = async ({id_promotion}) => {

  const response = await apiFetch("/administration/semestres/get", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id_promotion
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Erreur lors du chargement des semestres");
  }

  return data;
};

// =============================
// CHARGER SESSIONS PAR PROMOTION ET SEMESTRE
// =============================
export const getSessionsService = async ({ id_version, semestre_id }) => {
  if (!id_version || !semestre_id) {
    throw new Error(
      "Les paramètres id_version et semestre_id sont requis pour récupérer les sessions."
    );
  }

  const response = await apiFetch("/administration/sessions-get", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id_version, semestre_id }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Erreur lors du chargement des sessions");
  }

  return data.data; // on renvoie le tableau des sessions
};