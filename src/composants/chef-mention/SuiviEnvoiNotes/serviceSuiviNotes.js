import { apiFetch } from "../../accueils/apiService";

//Récupérer le suivi d'envoi des notes
export const getSuiviNotesService = async ({ id_version, semestre_id, session_id }) => {
  if (!id_version || !semestre_id || !session_id) {
    throw new Error(
      "Les paramètres id_version, semestre_id et session_id sont requis pour récupérer le suivi des notes."
    );
  }

  const response = await apiFetch("/administration/suivi-notes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id_version, semestre_id, session_id }),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Erreur récupération suivi notes");
  }

  return result.data;
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

// =============================
// PUBLIER LES RESULTATS
// =============================
export const publierResultatsService = async ({
  promotion_version_id,
  semestre_id,
  session_id,
  date_fin_pub
}) => {

  if (!promotion_version_id || !semestre_id || !session_id || !date_fin_pub) {
    throw new Error(
      "Les paramètres promotion_version_id, semestre_id, session_id et date_fin_pub sont requis."
    );
  }

  const response = await apiFetch("/administration/publication-resultats/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      promotion_version_id,
      semestre_id,
      session_id,
      date_fin_pub
    }),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Erreur lors de la publication des résultats");
  }

  return result.data;
};

// =============================
// VERIFIER STATUT PUBLICATION
// ============================= 
export const getStatutPublicationService = async ({ 
  promotion_version_id,
  semestre_id,
  session_id
}) => {

  if (!promotion_version_id || !semestre_id || !session_id) {
    throw new Error(
      "Les paramètres promotion_version_id, semestre_id et session_id sont requis."
    );
  }

  const response = await apiFetch("/administration/publication-resultats/statut", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      promotion_version_id,
      semestre_id,
      session_id
    }),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Erreur récupération statut publication");
  }

  return result.statut; // { statut: "en cours" } ou null
};