import { apiFetch } from "../../accueils/apiService";

// Récupérer les recours d’un enseignant (année en cours)
export const getRecoursEnseignantEnCoursService = async (enseignantId) => {
  try {
    const response = await apiFetch(
      "/enseignant/recours-get", 
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ enseignantId }),
      }
    );

    const data = await response.json();
 
    if (!response.ok) {
      throw new Error(
        data.message || "Erreur lors de la récupération des recours."
      );
    }

    return data.data; // 🔥 on renvoie directement la liste

  } catch (error) {
    throw error;
  }
};

//Accepter recours
export const acceptRecoursService = async ({id_recours, newCote }) => {
  try {
    const response = await apiFetch("/enseignant/recours/accept", {
      method: "POST",
      body: JSON.stringify({
        id_recours,
        newCote,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Erreur lors de l'acceptation du recours");
    }

    return data;

  } catch (error) {
    throw error;
  }
};

// Rejeter recours
export const rejectRecoursService = async ({id_recours, motif_rejet}) => {
  try {
    const response = await apiFetch(
      "/enseignant/recours/reject",
      {
        method: "POST",
        body: JSON.stringify({
          id_recours,
          motif_rejet,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message ||
          "Erreur lors du rejet du recours"
      );
    }

    return data;
  } catch (error) {
    throw error;
  }
}; 


