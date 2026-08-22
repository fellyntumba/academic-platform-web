import { apiFetch } from "../../accueils/apiService";

const BASE_URL = "/administration";

/* =========================
   1️⃣ Créer un administrateur fac
========================= */
export async function creerAdminFac({ code_fac, nom, email }) {
  try {
    const res = await apiFetch(`${BASE_URL}/admin-fac-desactive/create`, {
      method: "POST",
      body: JSON.stringify({ code_fac, nom, email }),
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
   2️⃣ Modifier un administrateur fac
========================= */
export async function modifierStatutAdminFac({ code_fac, id_admin, statut }) {
  try {
  
    const res = await apiFetch(`${BASE_URL}/admin-fac/modifier-statut`, {
      method: "POST",  // 🔹 On utilise POST comme demandé
      body: JSON.stringify({code_fac, id_admin, statut }),
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
   3️⃣ Récupérer  administrateurs fac par un code-fac
========================= */
export async function getAdminFacsCodeFac({ code_fac }) {
  try {
    const res = await apiFetch(
      `${BASE_URL}/admin-fac/get-actif`,
      {
        method: "POST",
        body: JSON.stringify({ code_fac }),
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


//LISTER ENSEIGNANTS (STATS)
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


/* =========================
   4️⃣ Récupérer tous les codes-facs
========================= */
export async function getCodeFac() {
  try {
    const res = await apiFetch(`${BASE_URL}/code-fac/get`, { method: "GET" });
    const data = await res.json();

    if (!res.ok) {
      return { success: false, message: data.message || "Erreur récupération facultés" };
    }

    return { success: true, data };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Erreur réseau." };
  }
}



