import { apiFetch } from "../accueils/apiService";


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

