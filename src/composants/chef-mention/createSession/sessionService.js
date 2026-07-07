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
// LANCER SESSION/PROMO
// =============================
export const lancerSessionService = async ({
  promotionVersionId,
  typeSession,
  semestreID,
  dateFin,
  codeMention
}) => {
  try {
    const payload = { promotionVersionId, typeSession, dateFin};

    // ==========================
    // 🔥 CAS DETTES
    // ==========================
    if (typeSession?.toLowerCase() === "dettes") {
      payload.codeMention = codeMention;
    } else {
      // ==========================
      // 🔥 AUTRES CAS (normale / rattrapage)
      // ==========================
      payload.semestreID = semestreID;
    }

    const response = await apiFetch("/administration/lancer-session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Erreur lors du lancement de la session."
      );
    }

    return data;

  } catch (error) {
    console.error("Erreur service lancerSession :", error);
    throw error;
  }
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