import { apiFetch } from "../../accueils/apiService";

const BASE_URL = "/administration";

/* =========================
   1️⃣ Créer ChefMention 
========================= */
export async function creerChefMention({ code_mention, nom, email }) {
  try {
    const res = await apiFetch(`${BASE_URL}/chefmention-desactive/create`, {
      method: "POST",
      body: JSON.stringify({ code_mention, nom, email }),
    });

    const data = await res.json();  

    if (!res.ok) {
      return { success: false, message: data.message || "Erreur lors de la création." };
    }

    return { success: true, message: data.message || "ChefMention créé." };
  } catch (error) { 
    console.error(error);
    return { success: false, message: "Erreur réseau." };
  }
}

/* =========================
   2️⃣ Modifier  ChefMention 
========================= */
export async function modifierStatutChefMention({ code_mention, id_admin, statut }) {
  try {
  
    const res = await apiFetch(`${BASE_URL}/chefmention/modifier-statut`, {
      method: "PUT",  
      body: JSON.stringify({code_mention, id_admin, statut }),
    });

    const data = await res.json();

    if (!res.ok) {
      return { success: false, message: data.message || "Erreur lors de la modification." };
    }

    return { success: true, message: data.message || "ChefMention modifié." };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Erreur réseau." };
  }
}

/* =========================
   3️⃣ Récupérer ChefMentions par code_mention
========================= */
export async function getChefMentionsCodeMention({ code_mention }) {
  try {
    const res = await apiFetch(
      `${BASE_URL}/chefmentions/get`,
      {
        method: "POST",
        body: JSON.stringify({ code_mention }),
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
   Récupérer tous les code_mentions par code_faculte
========================= */
export async function getCodeMentionsBDuniv({code_faculte}) {
  try {
    const response = await apiFetch(`${BASE_URL}/code-mention/get`, { 
      method: "POST",
      body: JSON.stringify({ code_faculte}),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || "Erreur lors de la récupération des mentions.",
        data: [],
      };
    }

    return {
      success: true,
      data: data.data || [],
    };

  } catch (error) {
    console.error(
      "Erreur récupération mentions :",
      error

    );

    return {
      success: false,
      message: "Erreur réseau.",
      data: [],
    };
  }

}


