import {apiFetch} from "../../accueils/apiService"; 


// Créer une faculté-année (version faculté)
export const createFacAnneeService = async ({code_faculte, nom_faculte_version}) => {
  try {
    const response = await apiFetch("/administration/faculte-version/create", {
      method: "POST",
      body: JSON.stringify({
        code_faculte,
        nom_faculte_version
      })
    });
 
    // Lire le JSON
    const data = await response.json();
    return data; // ✅ Maintenant data.message et data.success existent

  } catch (error) {
    throw new Error(error.message || "Erreur lors de la création de la faculté-année.");
  }
};

//Récupérer la version unique d'une faculté pour l'année en cours
export const getFaculteVersionService = async ({ code_faculte }) => {
  try {
    // 🔹 POST pour rester cohérent, body contient code_faculte
    const res = await apiFetch("/administration/faculte-version/get", {
      method: "POST",
      body: JSON.stringify({ code_faculte }), 
    });

    const data = await res.json();

    return data;

  } catch (error) {
    return { success: false, message: error.message || "Erreur lors de la récupération de la version." };
  }
};

// Modifier le nom d'une version de faculté
export const modifyFaculteVersionService = async ({ code_faculte, id_version, nouveau_nom }) => {
  try {
    const res = await apiFetch("/administration/faculte-version/modify", {
      method: "PUT",
      body: JSON.stringify({
        code_faculte,
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
   Récupérer la faculté versions pour annee passee
========================= */
export const getFaculteVersionByCodeAnneePasseeService = async ({ code_faculte }) => {
  try {
 
    const response = await apiFetch("/administration/faculte-version/code_faculte/annee-passee", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code_faculte }) 
    });

    const data = await response.json();

    return data; // { success, message, data }

  } catch (error) {

    console.error("Erreur récupération facultés versions :", error);

    return {
      success: false,
      message: "Erreur réseau lors de la récupération des facultés",
      data: []
    };
  }
};

