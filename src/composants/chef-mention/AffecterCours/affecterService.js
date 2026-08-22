import { apiFetch } from "../../accueils/apiService";

// Récupérer les enseignants actifs
export const getActiveEnseignantsService = async () => {

  const response = await apiFetch("/administration/enseignants-actifs");

  const data = await response.json(); 

  if (!response.ok) {
    throw new Error(
      data.message || "Erreur lors du chargement des enseignants actifs"
    );
  }

  return data;
};

//Charger les cours / mention
export const getCoursByMentionService = async ({code_mention}) => {

  const response = await apiFetch("/administration/cours-by-mention/get", {
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
    throw new Error(data.message || "Erreur chargement cours");
  }

  return data;
};


// Affecter un cours 
export const affecterCoursService = async ({
  selectedMatricule,
  id_cours,
  id_semestre
}) => {

  const response = await apiFetch("/administration/affecter-cours", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      selectedMatricule,
      id_cours,
      id_semestre
    })
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Erreur lors de l'affectation du cours");
  }

  return data;
};


// Reconduire les affectations de l'année précédente
export const reconduireAffectationsService = async ({ code_mention }) => {

  const response = await apiFetch("/administration/maintenir-affecter-cours", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      code_mention,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Erreur lors de la reconduction des affectations."
    );
  }

  return data;
};