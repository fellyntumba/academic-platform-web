import {apiFetch} from "../../accueils/apiService"; 


// Créer une mention-année (version mention)
export const createMentionAnneeService = async ({code_mention, nom_mention_version}) => {
  try {
    const response = await apiFetch("/administration/mention-version/create", {
      method: "POST",
      body: JSON.stringify({
        code_mention,
        nom_mention_version 
      }) 
    });
 
    // Lire le JSON
    const data = await response.json();
    return data; // ✅ Maintenant data.message et data.success existent

  } catch (error) {
    throw new Error(error.message || "Erreur lors de la création de la mention-année.");
  }
};

//Récupérer la version unique d'une mention pour l'année en cours
export const getMentionVersionService = async ({ code_mention }) => {
  try {
    // 🔹 POST pour rester cohérent, body contient code_faculte
    const res = await apiFetch("/administration/mention-version/get", {
      method: "POST",
      body: JSON.stringify({ code_mention }),
    });

    const data = await res.json();

    return data;

  } catch (error) {
    return { success: false, message: error.message || "Erreur lors de la récupération de la version." };
  }
};

// Modifier le nom d'une version de mention
export const modifyMentionVersionService = async ({ code_mention, id_version, nouveau_nom }) => {
  try {
    const res = await apiFetch("/administration/mention-version/modify", {
      method: "PUT",
      body: JSON.stringify({
        code_mention,
        id_version,
        nouveau_nom
      }),
    });

    const data = await res.json();

    return data;

  } catch (error) {
    return { success: false, message: error.message || "Erreur lors de la modification de la version." };
  }
};


/* =========================
   Récupérer la mention version pour annee passee
========================= */
export const getMentionVersionByCodeAnneePasseeService = async ({ code_mention }) => {
  try {
 
    const response = await apiFetch("/administration/mention-version/code_mention/annee-passee", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code_mention }) 
    });

    const data = await response.json();

    return data; // { success, message, data }

  } catch (error) {

    console.error("Erreur récupération mention versions :", error);

    return {
      success: false,
      message: "Erreur réseau lors de la récupération de la mention",
      data: []
    };
  }
};

