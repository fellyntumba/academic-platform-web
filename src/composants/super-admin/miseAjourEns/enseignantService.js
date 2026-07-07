import { apiFetch } from "../authentification/apiService";

// Création enseignant.  
export const createEnseignant = async ({ nom, email, telephone, titre }) => {
  const res = await apiFetch("/administration/enseignants/create", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nom, email, telephone, titre }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data; // { message: "Enseignant créé avec succès", matricule: "ENS001" }
};


// Récupérer un enseignant par matricule
export const getEnseignantByMatricule = async (matricule) => {
  const res = await apiFetch("/administration/enseignants-by-matr", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({matricule}),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Erreur récupération enseignant");
  return data; 
  // Exemple : { matricule: "ENS001", nom: "Jean Dupont", email: "...", telephone: "...", titre: "Dr" }
};

// Récupérer tous les matricules existants
export const getEnseignantsMatricules = async () => {
  const res = await apiFetch("/administration/enseignants/all-matricules", { 
    method: "GET",
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Erreur récupération matricules");
  return data; // Exemple : [{ matricule: "ENS001" }, { matricule: "ENS002" }]
};

// Modifier un enseignant
export const updateEnseignant = async ({matricule,nom,email,telephone,titre, statut}) => {
  const res = await apiFetch("/administration/enseignants/update", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      matricule,
      nom,
      email,
      telephone,
      titre,
      statut
    }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Erreur modification enseignant");
  return data; // { message: "Enseignant modifié avec succès" }
};
