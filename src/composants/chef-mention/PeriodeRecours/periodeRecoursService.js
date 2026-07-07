import { apiFetch } from "../apiService";

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
// CHARGER SEMESTRES & SESSIONS (RECours)
// ============================= 
export const getSemestresEtSessionsRecoursService = async ({ promotionVersionId }) => {

  if (!promotionVersionId) {
    throw new Error("promotionVersionId est requis.");
  }

  const response = await apiFetch("/administration/semestres-sessions-recours", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      promotionVersionId
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Erreur chargement semestres et sessions");
  }

  return {
    semestres: data.semestres || [],
    sessions: data.sessions || []
  };
};


// =============================
// LANCER PERIODE RECOURS
// =============================
export const lancerRecoursService = async ({
  promotionVersionId,
  sessionId,
  semestreID,
  dateFinRecours
}) => {
  try {
    const response = await apiFetch("/administration/periode-recours/lancer", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        promotion_version_id: promotionVersionId,
        session_id: sessionId,
        semestre_id: semestreID,
        date_fin: dateFinRecours
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Erreur lors du lancement de la période de recours."
      );
    }

    return data;

  } catch (error) {
    console.error("Erreur service lancerRecours :", error);
    throw error;
  }
};
