import { apiFetch } from "../apiService";

export const getCoursFaculteAnneeActiveService = async (nomFaculte) => {
  try {
    const response = await apiFetch("/administration/cours/faculte/annee-active",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nomFaculte }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Erreur lors du chargement des cours.");
    }

    return data.data;

  } catch (error) {
    throw error;
  }
};