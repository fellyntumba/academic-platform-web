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

 
// =====================================================
// RÉCUPÉRER LES TARIFS ET TRANCHES
// D'UNE PROMOTION VERSION
// =====================================================
export const getTarifsTranchesByPromotionVersionService = async ({
  promotion_version_id,
}) => {

  if (
    promotion_version_id === undefined ||
    promotion_version_id === null ||
    promotion_version_id === ""
  ) {
    throw new Error(
      "promotion_version_id est requis"
    );
  }

  const response = await apiFetch(
    "/administration/promotion/tarifs-tranchess/get",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        promotion_version_id,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Erreur lors du chargement des tarifs et tranches"
    );
  }

  return data;
};
 

// =====================================================
// CRÉER UNE RESSOURCE D'ACCÈS
// AVEC SA RÈGLE ET SES TRANCHES
// =====================================================
export const createRessourceAccesAvecRegleService = async ({
  code,
  id_promotion_version,
  tranche_id,
}) => {


  if (
    code === undefined ||
    code === null ||
    !String(code).trim()
  ) {
    throw new Error(
      "code est requis"
    );
  }


  if (
    id_promotion_version === undefined ||
    id_promotion_version === null ||
    id_promotion_version === "" ||
    !Number.isInteger(
      Number(id_promotion_version)
    ) ||
    Number(id_promotion_version) <= 0
  ) {
    throw new Error(
      "id_promotion_version est requis et doit être un identifiant valide"
    );
  }


  if (
    !Array.isArray(tranche_id) ||
    tranche_id.length === 0
  ) {
    throw new Error(
      "Au moins une tranche doit être associée à la règle d'accès"
    );
  }

  const trancheIds =
    tranche_id.map(Number);

  if (
    trancheIds.some(
      (id) =>
        !Number.isInteger(id) ||
        id <= 0
    )
  ) {
    throw new Error(
      "Tous les identifiants de tranches doivent être des entiers positifs"
    );
  }

  const response = await apiFetch(
    "/administration/ressources-acces/create",
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        code: String(code).trim(),

        id_promotion_version:
          Number(id_promotion_version),

        tranche_id:
          trancheIds,
      }),
    }
  );


  const data =
    await response.json();


  if (!response.ok) {
    throw new Error(
      data.message ||
        "Erreur lors de la création de la ressource d'accès"
    );
  }

  // -----------------------------------------------------
  // SUCCÈS
  // -----------------------------------------------------

  return data;
};



// RÉCUPÉRER LES RESSOURCES D'ACCÈS
// D'UNE PROMOTION VERSION
export const getRessourcesAccesByPromotionVersionService = async ({
    promotion_version_id,
  }) => {

    if (
      promotion_version_id === undefined ||
      promotion_version_id === null ||
      promotion_version_id === ""

    ) {

      throw new Error(
        "promotion_version_id est requis"
      );

    }

    const response = await apiFetch(
      "/administration/promotion/ressources-acces/get",
      {

        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          promotion_version_id,
        }),

      }

    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message ||
          "Erreur lors du chargement des ressources d'accès"

      );

    }

    return data;

  };



// SUPPRIMER COMPLÈTEMENT UNE RESSOURCE D'ACCÈS
// + SA RÈGLE D'ACCÈS
// + SES ASSOCIATIONS AVEC LES TRANCHES
export const deleteRessourceAccesByPromotionService = async ({
  promotion_version_id,
  ressource_id,
}) => {

  if (
    promotion_version_id === undefined ||
    promotion_version_id === null ||
    promotion_version_id === ""
  ) {
    throw new Error(
      "promotion_version_id est requis"
    );
  }

  if (
    ressource_id === undefined ||
    ressource_id === null ||
    ressource_id === ""
  ) {
    throw new Error(
      "ressource_id est requis"
    );
  }

  const promotionVersionId =
    Number(promotion_version_id);

  const ressourceId =
    Number(ressource_id);

  if (!Number.isInteger(promotionVersionId)) {
    throw new Error(
      "promotion_version_id invalide"
    );
  }

  if (!Number.isInteger(ressourceId)) {
    throw new Error(
      "ressource_id invalide"
    );
  }

  console.log(
    "DELETE RESOURCE PAYLOAD :",
    {
      promotion_version_id: promotionVersionId,
      ressource_id: ressourceId,
    }
  );

  const response = await apiFetch(
    "/administration/promotion/ressources-acces/delete",
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        promotion_version_id:
          promotionVersionId,

        ressource_id:
          ressourceId,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Erreur lors de la suppression de la ressource d'accès"
    );
  }

  return data;
};