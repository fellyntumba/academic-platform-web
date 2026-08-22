import { apiFetch } from "../../accueils/apiService";


export const importEtudiantsInscrits = async (file, promotion) => {

  try {
   
    if (!file) throw new Error("Aucun fichier sélectionné.");
    if (!promotion) throw new Error("Promotion non sélectionnée.");

    const formData = new FormData();

    formData.append("file", file);
    formData.append("nomPromotion", promotion); // 🔥 ajout promotion

    const response = await apiFetch(
      "/administration/etudiants/inscrits/import",
      {
        method: "POST",
        body: formData
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Erreur lors de l'importation du fichier.");
    }

    return data;

  } catch (error) {
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
// INSCRIRE UN ÉTUDIANT
// =============================
export const inscrireEtudiantService = async ({
  ancienMatricule,
  nom,
  postnom,
  prenom,
  sexe,
  nom_promotion
}) => {

  try {

    const response = await apiFetch(
      "/administration/etudiant/inscrit",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ancienMatricule: ancienMatricule.trim().toUpperCase(),
          nom: nom.trim(),
          postnom: postnom.trim(),
          prenom: prenom.trim(),
          sexe,
          nom_promotion
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message ||
        "Erreur lors de l'inscription de l'étudiant."
      );
    }

    return data;

  } catch (error) {

    throw error;

  }

};
