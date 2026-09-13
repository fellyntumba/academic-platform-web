import { apiFetch } from "../../accueils/apiService";

const BASE_URL = "/administration";



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
// CHARGER PARCOURS PAR MENTION
// =============================
export const getParcoursService = async ({code_mention}) => {

  const response = await apiFetch("/administration/parcours/get", {
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
    throw new Error(data.message || "Erreur lors du chargement des parcours");
  }

  return data;
};



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


//Récupérer la version unique d'une mention 
export const getMentionVersionService = async ({ code_mention }) => {
  try {
    // 🔹 POST pour rester cohérent, body contient code_faculte
    const res = await apiFetch("/administration/mention-version/get", {
      method: "POST",
      body: JSON.stringify({ code_mention }),
    });

    const data = await res.json();

    return data;

  } catch (error) {
    return { success: false, message: error.message || "Erreur lors de la récupération de la version." };
  }
};


