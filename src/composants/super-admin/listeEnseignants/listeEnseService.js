import { apiFetch } from "../authentification/apiService";

// ==============================
// 🔹 LISTER ENSEIGNANTS (STATS)
// ==============================
export const getEnseignantsStatsService = async () => {
  const res = await apiFetch("/administration/enseignants/stats", {
    method: "GET",
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(
      data.message || "Erreur lors du chargement des enseignants."
    );
  }

  return data.data; 
  // 👉 retourne directement le tableau :
  // [{ id_enseignant, matricule, nom, total_cours, facultes }]
};

