import { apiFetch } from "../../accueils/apiService";

const BASE_URL = "/administration";



// ============================================================
// CRÉER UN COMMUNIQUÉ
// ============================================================
export const createCommuniqueService = async ({
  objet,
  priorite,
  dateExpiration,
  typeCible,
  cibleId,
  fichier,
}) => {

  // ==========================================================
  // VALIDATION FRONTEND
  // ==========================================================

  if (!objet || !objet.trim()) {
    throw new Error(
      "L'objet du communiqué est obligatoire."
    );
  }

  if (!priorite) {
    throw new Error(
      "La priorité du communiqué est obligatoire."
    );
  }

  if (!typeCible) {
    throw new Error(
      "Le type de cible est obligatoire."
    );
  }

  if (!cibleId) {
    throw new Error(
      "Id cible est obligatoire."
    );
  }

  if (!fichier) {
    throw new Error(
      "Le fichier du communiqué est obligatoire."
    );
  }

  // ==========================================================
  // FORM DATA
  // ==========================================================

  const formData = new FormData();

  formData.append(
    "objet",
    objet.trim()
  );

  formData.append(
    "priorite",
    priorite
  );

  formData.append(
    "dateExpiration",
    dateExpiration || ""
  );

  formData.append(
    "typeCible",
    typeCible
  );

  formData.append(
    "cibleId",
    cibleId
  );

  // ==========================================================
  // FICHIER
  // ==========================================================

  formData.append(
    "fichier",
    fichier
  );

  // ==========================================================
  // REQUÊTE
  // ==========================================================

  const response = await apiFetch(
    "/administration/communique/create",
    {
      method: "POST",
      body: formData,
    }
  );

  // ==========================================================
  // RÉPONSE
  // ==========================================================

  const data = await response.json();

  // ==========================================================
  // ERREUR HTTP
  // ==========================================================

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Erreur lors de la création du communiqué."
    );
  }

  // ==========================================================
  // RÉSULTAT
  // ==========================================================

  return data;
};



// ============================================================
// RÉCUPÉRER LA VERSION D'UNE FACULTÉ
// POUR L'ANNÉE ACADÉMIQUE EN COURS
// ============================================================
export const getFaculteVersionByCodeFacService = async ({
  code_faculte,
}) => {

  // ==========================================================
  // VALIDATION
  // ==========================================================

  if (!code_faculte || !code_faculte.trim()) {
    throw new Error(
      "Le code faculté est obligatoire."
    );
  }

  // ==========================================================
  // REQUÊTE
  // ==========================================================

  const response = await apiFetch(
    `${BASE_URL}/faculte-version-by-fac/get`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        code_faculte: code_faculte.trim(),
      }),
    }
  );

  // ==========================================================
  // RÉPONSE
  // ==========================================================

  const data = await response.json();

  // ==========================================================
  // ERREUR HTTP
  // ==========================================================

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Erreur lors de la récupération de la faculté."
    );
  }

  // ==========================================================
  // RÉSULTAT
  // ==========================================================

  return data;
};



// ============================================================
// RÉCUPÉRER LES MENTIONS D'UNE FACULTÉ
// POUR L'ANNÉE ACADÉMIQUE EN COURS
// ============================================================
export const getMentionsVersionsByCodeFacService = async ({
  code_faculte,
}) => {

  // ==========================================================
  // VALIDATION
  // ==========================================================

  if (!code_faculte || !code_faculte.trim()) {
    throw new Error(
      "Le code faculté est obligatoire."
    );
  }

  // ==========================================================
  // REQUÊTE
  // ==========================================================

  const response = await apiFetch(
    `${BASE_URL}/mentions-version-by-fac/get`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        code_faculte: code_faculte.trim(),
      }),
    }
  );

  // ==========================================================
  // RÉPONSE
  // ==========================================================

  const data = await response.json();

  // ==========================================================
  // ERREUR HTTP
  // ==========================================================

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Erreur lors de la récupération des mentions."
    );
  }

  // ==========================================================
  // RÉSULTAT
  // ==========================================================

  return data;
};



// ============================================================
// RÉCUPÉRER LES PARCOURS D'UNE FACULTÉ
// POUR L'ANNÉE ACADÉMIQUE EN COURS
// ============================================================
export const getParcoursVersionsByCodeFacService = async ({
  code_faculte,
}) => {

  // ==========================================================
  // VALIDATION
  // ==========================================================

  if (!code_faculte || !code_faculte.trim()) {
    throw new Error(
      "Le code faculté est obligatoire."
    );
  }

  // ==========================================================
  // REQUÊTE
  // ==========================================================

  const response = await apiFetch(
    `${BASE_URL}/parcours-version-by-fac/get`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        code_faculte: code_faculte.trim(),
      }),
    }
  );

  // ==========================================================
  // RÉPONSE
  // ==========================================================

  const data = await response.json();

  // ==========================================================
  // ERREUR HTTP
  // ==========================================================

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Erreur lors de la récupération des parcours."
    );
  }

  // ==========================================================
  // RÉSULTAT
  // ==========================================================

  return data;
};



// ============================================================
// RÉCUPÉRER LES PROMOTIONS D'UNE FACULTÉ
// POUR L'ANNÉE ACADÉMIQUE EN COURS
// ============================================================
export const getPromotionsVersionsByCodeFacService = async ({
  code_faculte,
}) => {

  // ==========================================================
  // VALIDATION
  // ==========================================================

  if (!code_faculte || !code_faculte.trim()) {
    throw new Error(
      "Le code faculté est obligatoire."
    );
  }

  // ==========================================================
  // REQUÊTE
  // ==========================================================

  const response = await apiFetch(
    `${BASE_URL}/promotions-version-by-fac/get`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        code_faculte: code_faculte.trim(),
      }),
    }
  );

  // ==========================================================
  // RÉPONSE
  // ==========================================================

  const data = await response.json();

  // ==========================================================
  // ERREUR HTTP
  // ==========================================================

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Erreur lors de la récupération des promotions."
    );
  }

  // ==========================================================
  // RÉSULTAT
  // ==========================================================

  return data;
};





