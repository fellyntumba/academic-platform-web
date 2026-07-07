import { apiFetch } from "./apiService"; // ton fichier avec apiFetch

export const createAnneeAcademique = async ({ libelle, statut }) => {
  const response = await apiFetch("/administration/annee-academique", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ libelle, statut }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Erreur lors de la création");
  }

  return response.json();
};
