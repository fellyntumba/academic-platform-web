import { apiFetch } from "../apiService";




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
// CRÉER UNE UE + COURS
// =============================
export const createUEService = async ({
  nom_ue,
  promotion_version_id,
  semestre_id,
  cours,
}) => {

  const nomUeFormate = nom_ue.trim().toUpperCase();
  const coursFormates = cours.map((c) => ({
    ...c,
    nom: c.nom.trim().charAt(0).toUpperCase() + c.nom.trim().slice(1).toLowerCase(),

  }))
  const response = await apiFetch("/administration/ue-create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      nom_ue : nomUeFormate,
      promotion_version_id,
      semestre_id,
      cours: coursFormates, 
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Erreur création UE");
  }

  return data;
};



// =============================
// UPDATE UE + COURS
// =============================
export const updateUEService = async ({
  ue_id,
  nom_ue,
  promotion_version_id,
  semestre_id,
  cours,
  delete_cours_ids = []
}) => {
      const nomUeFormate = nom_ue.trim().toUpperCase();
      const coursFormates = cours.map((c) => ({
        ...c,
        nom: c.nom.trim().charAt(0).toUpperCase() + c.nom.trim().slice(1).toLowerCase(),

      }))

  try {
    const response = await apiFetch("/administration/ue-update", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ue_id,
        nom_ue : nomUeFormate,
        promotion_version_id,
        semestre_id,
        cours: coursFormates,
        delete_cours_ids,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Erreur lors de la mise à jour de l'UE");
    }

    return data;

  } catch (error) {
    console.error("❌ updateUEService error:", error);
    throw error;
  }
}; 


// =============================
// CHARGER LES UE PAR PROMOTION + SEMESTRE
// =============================
export const getUEService = async ({
  promotion_version_id,
  semestre_id
}) => { 

  const response = await apiFetch("/administration/ue-get", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      promotion_version_id,
      semestre_id
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Erreur chargement UE");
  }

  return data;
};

/* =========================
   Récupérer les UE d'une promotion
   pour l'année académique passée
========================= */
export const getUEByPromotionAnneePasseeService = async ({
  nom_promotion
}) => {
  try {

    const response = await apiFetch("/administration/ue/promotion/annee-passee", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          nom_promotion
        })
      }
    );

    const data = await response.json();
  
    return data;

  } catch (error) {

    console.error(
      "Erreur récupération unités d'enseignement :",
      error
    );

    return {
      success: false,
      message:
        "Erreur réseau lors de la récupération des unités d'enseignement.",
      data: []
    };
  }
};


// =============================
// SUPPRIMER UNE UE + SES COURS
// =============================
export const deleteUEService = async ({ ue_id }) => {
  try {
    const response = await apiFetch("/administration/ue-delete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ue_id,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Erreur lors de la suppression de l'UE");
    }

    return data;

  } catch (error) {
    console.error("❌ deleteUEService error:", error);
    throw error;
  }
};