import { apiFetch } from "../../accueils/apiService";

/**
 * Envoyer un fichier Excel pour importer les étudiants
 * @param {File} file - le fichier Excel sélectionné
 * @returns {Object} - résultat de l'import (inserted / updated)
 */
export const importEtudiantsOrdres = async (file) => {
  try {
    if (!file) throw new Error("Aucun fichier sélectionné.");

    // Créer un FormData pour envoyer le fichier
    const formData = new FormData();
    formData.append("file", file); 

    // Appel API
    const response = await apiFetch("/administration/situation-financiere/import", {
      method: "POST",
      body: formData,
      // Pas besoin de Content-Type, le navigateur le met automatiquement pour FormData
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Erreur lors de l'importation du fichier.");
    }

    return data; // { inserted: X, updated: Y }

  } catch (error) {
    throw error;
  }
};



// Enregistrer la situation financière d'un étudiant
export const enregistrerSituationFinanciereService = async ({
  matricule,
}) => {

  try {

    const response = await apiFetch(
      "/administration/situation-financiere",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          matricule: matricule.trim().toUpperCase(),
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message ||
        "Erreur lors de l'enregistrement de la situation financière."
      );
    }

    return data;

  } catch (error) {

    throw error;

  }

};
