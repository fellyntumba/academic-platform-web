import { apiFetch } from "./authentification/apiService";


// Récupérer l'année académique en cours
export const getAnneeAcademiqueEnCoursService = async () => {

  try {

    const response = await apiFetch("/enseignant/annee-academique/en-cours",
      {
        method: "GET"
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Erreur lors de la récupération de l'année académique.");
    }

    return data;

  } catch (error) {

    throw error;

  }

};

// Récupérer le nombre de recours en attente pour un enseignant
export const getNombreRecoursEnAttenteService = async (enseignantId) => {

  try {

    const response = await apiFetch(
      "/enseignant/recours-en-attente",
      {
        method: "POST",
        body: JSON.stringify({
          enseignantId: enseignantId,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Erreur lors de la récupération des recours en attente."
      );
    }

    return data;

  } catch (error) {

    throw error;

  }
};


