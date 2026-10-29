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
  cibleIds,
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

  if (
    !Array.isArray(cibleIds) ||
    cibleIds.length === 0
  ) {
    throw new Error(
      "Au moins une cible est obligatoire."
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

  /*
   * Les cibles sont maintenant transmises
   * sous forme de tableau JSON.
   *
   * Exemple établissement :
   *
   * [12, 13, 14, 15]
   *
   * Exemple faculté :
   *
   * [13]
   */

  formData.append(
    "cibleIds",
    JSON.stringify(cibleIds)
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
    "/administration/communique-sga-dg/create",
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
// RÉCUPÉRER LES FACULTÉS VERSIONS
// DE L'ANNÉE ACADÉMIQUE EN COURS
// ============================================================
export const getFacultesVersionsAnneeEnCoursService =
  async () => {

    const response = await apiFetch(
      `${BASE_URL}/facultes-versions-annee-en-cours/get`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data =
      await response.json();

    if (!response.ok) {
      throw new Error(
        data.message ||
          "Erreur lors de la récupération des facultés."
      );
    }

    return data;
  };

