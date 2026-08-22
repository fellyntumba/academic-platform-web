import { apiFetch } from "../../accueils/apiService";

const BASE_URL = "/administration";

/* =========================
   1️⃣ Créer un administrateur fac
========================= */
export async function creerSga({ nom, email }) {
  try {
    const res = await apiFetch(`${BASE_URL}/super-admin-desactive/create`, {
      method: "POST",
      body: JSON.stringify({  nom, email }),
    });

    const data = await res.json(); 

    if (!res.ok) {
      return { success: false, message: data.message || "Erreur lors de la création." };
    }

    return { success: true, message: data.message || "Administrateur créé." };
  } catch (error) { 
    console.error(error);
    return { success: false, message: "Erreur réseau." };
  }
}

/* =========================
   2️⃣ Désactiver un administrateur fac
========================= */
export async function modifierStatutSga({  id_admin, statut }) {
  try {
  
    const res = await apiFetch(`${BASE_URL}/super-admin/modifier-statut`, {
      method: "PUT",  
      body: JSON.stringify({ id_admin, statut }),
    });

    const data = await res.json();

    if (!res.ok) {
      return { success: false, message: data.message || "Erreur lors de la modification." };
    }

    return { success: true, message: data.message || "Administrateur modifié." };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Erreur réseau." };
  }
}

/* =========================
   3️⃣ Récupérer un administrateur fac actif pour un code-fac
========================= */
export async function getAllSga() {
  try {
    const res = await apiFetch(
      `${BASE_URL}/super-admin/get-all`, 
      {
        method: "GET",

      }
    );

    const data = await res.json();

    if (!res.ok) {
      return {
        success: false,
        message:
          data.message ||
          "Erreur lors de la récupération."
      };
    }

    return {
      success: true,
      admins: data.admins || []
    };

  } catch (error) {
    console.error(error);

    return {
      success: false,
      message: "Erreur réseau."
    };
  }
}

//LISTER ENSEIGNANTS
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
