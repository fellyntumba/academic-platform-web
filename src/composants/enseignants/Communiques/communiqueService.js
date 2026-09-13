import { apiFetch } from "../../accueils/apiService";

// ============================================================
// RÉCUPÉRER LES PROMOTIONS / VERSIONS
// OÙ L'ENSEIGNANT DONNE DES COURS
// POUR L'ANNÉE ACADÉMIQUE EN COURS
// ============================================================

export const getPromotionsEnseignantService = async ({
  enseignantId,
}) => {
  try {
    if (!enseignantId) {
      throw new Error(
        "L'identifiant de l'enseignant est obligatoire."
      );
    }

    const response = await apiFetch(
      "/enseignant/promotions-communiques-get",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          enseignantId,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message ||
          "Erreur lors de la récupération des promotions."
      );
    }

    return data;
  } catch (error) {
    console.error(
      "Erreur getPromotionsEnseignantService :",
      error
    );

    throw error;
  }
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
  enseignantId,
}) => {
  // ==========================================================
  // VALIDATION
  // ==========================================================

  if (!enseignantId) {
    throw new Error(
      "L'identifiant de l'enseignant est obligatoire."
    );
  }

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

  if (typeCible !== "promotion") {
    throw new Error(
      "Le type de cible sélectionné est invalide."
    );
  }

  if (!cibleId) {
    throw new Error(
      "L'identifiant de la promotion est obligatoire."
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
    String(cibleId)
  );

  formData.append(
    "enseignantId",
    String(enseignantId)
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
    "/enseignant/communique-enseignant/create",
    {
      method: "POST",
      body: formData,
    }
  );

  // ==========================================================
  // RÉPONSE
  // ==========================================================

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Erreur lors de la création du communiqué."
    );
  }

  return data;
};



