import { apiFetch } from "../../accueils/apiService";


// ===============================
// PROMOTIONS D'UN ENSEIGNANT(SESSION NORMMALE / RATTRAPAGE)
// ===============================
export const getPromotionsEnseignantService = async ({enseignantId, typeSession}) => {

  try { 

    const response = await apiFetch(
      "/enseignant/promotions-get",
      {
        method: "POST",
        headers: { 
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          enseignantId,
          typeSession
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Erreur récupération promotions."
      );
    }

    return data;

  } catch (error) {

    console.error("Erreur service promotions :", error);
    throw error;

  }

};


// ===============================
// COURS D'UNE PROMOTION
// ===============================
export const getCoursEnseignantPromotionService = async ({enseignantId, promotionVersionId, sessionId}) => {

  try {

    const response = await apiFetch(
      "/enseignant/cours-get",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          enseignantId,
          promotionVersionId,
          sessionId
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Erreur récupération cours."
      );
    }

    return data;

  } catch (error) {

    console.error("Erreur service cours :", error);
    throw error;

  }

};

// ===============================
// ETUDIANTS POUR SAISIE COTES
// ===============================
export const getEtudiantsSessionService = async ({promotionVersionId, coursId, sessionId}) => {

  try {

    const response = await apiFetch(
      "/enseignant/etudiants-matricules-get",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        }, 
        body: JSON.stringify({
          promotionVersionId,
          coursId,
          sessionId
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Erreur récupération étudiants."
      );
    }

    return data;

  } catch (error) {

    console.error("Erreur service étudiants :", error);
    throw error;

  }

};


//Recuperer les cours et promotions attachés à un enseignant/session dettes
export const getCoursDettesEnseignantService = async ({
  enseignantId
}) => {  

  try {

    const response = await apiFetch(
      "/enseignant/cours-dettes",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          enseignantId
        })
      }
    );

    const data = await response.json();
    

    if (!response.ok) {
      throw new Error(
        data.message ||
        "Erreur lors de la récupération des cours de dettes."
      );
    }

    return data;

  } catch (error) {

    console.error(
      "Erreur service cours dettes enseignant :",
      error
    );

    throw error;

  }

};
 
// Récupérer les situations des étudiants ayant des dettes
export const getEtudiantsDettesParCoursService = async ({
  coursNom,
  enseignantId,
  typeSession
}) => {

  try {

    const response = await apiFetch(
      "/enseignant/etudiants-dettes-get",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          coursNom,
          enseignantId,
          typeSession
        })
      }
    );

    const data = await response.json();
    console.log(data);
    

    if (!response.ok) {
      throw new Error(
        data.message ||
        "Erreur lors de la récupération des étudiants en dettes."
      );
    }

    return data;

  } catch (error) {

    console.error(
      "Erreur service étudiants dettes :",
      error
    );

    throw error;

  }

};

// =============================== 
// ENREGISTRER LES COTES
// ===============================
export const enregistrerCotesService = async (cotesListe) => {
  try {
    const response = await apiFetch(
      "/enseignant/cotes-enregistrer",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ cotes: cotesListe })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Erreur lors de l'enregistrement des cotes.");
    }

    return data;

  } catch (error) {
    console.error("Erreur service enregistrement cotes :", error);
    throw error;
  }
};

// ===============================
// FICHE DES COTES
// ===============================
export const getFicheCotesService = async ({
  promotionVersionId,
  coursId,
  typeSession,
  enseignantId
}) => {

  try {

    const response = await apiFetch(
      "/enseignant/fiche-cotes",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          promotionVersionId,
          coursId,
          typeSession,
          enseignantId
        })
      }
    );

    if (!response.ok) {
      throw new Error(
        data.message || "Erreur récupération fiche des cotes."
      );
     
    }

    // ✅ Convertir la réponse en blob (le fichier PDF)
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      // ✅ Créer et cliquer sur le lien de téléchargement
      const a = document.createElement('a');
      a.href = url;
      a.download = 'notes.pdf';
      document.body.appendChild(a);
      a.click();
      a.remove();

      // ✅ Nettoyer l’URL temporaire
      window.URL.revokeObjectURL(url);

      return { ok: true };

  } catch (error) {

    console.error("Erreur service fiche cotes :", error);
    throw error;

  }

};

// Generer les statistiques de cotes/cours
export const obtenirStatistiquesCotesCours = async ({
  promotionVersionId,
  coursId,
  typeSession,
  enseignantId
}) => {

  try {

    const response = await apiFetch(
      "/enseignant/statistiques-cotes",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          promotionVersionId,
          coursId,
          typeSession,
          enseignantId
        })
      }
    );

    if (!response.ok) {
      throw new Error("Erreur récupération statistiques");
    }

    const blob = await response.blob();

    return blob;

  } catch (error) {

    console.error("Erreur statistiques :", error);
    return null;

  }

};


//Ajouter Points à tout Etudiant
export const ajouterPointsToutEtudiantService = async ({

  promotionVersionId,

  coursId,

  sessionId,

  points

}) => {

  try {

    const response = await apiFetch(

      "/enseignant/ajouter-points-tous-etudiants",

      {

        method: "POST",

        headers: {

          "Content-Type": "application/json"

        },

        body: JSON.stringify({

          promotionVersionId,

          coursId,

          sessionId,

          points

        })

      }

    );

    const data = await response.json();

    if (!response.ok) {

      throw new Error(

        data.message || "Erreur lors de l'ajout des points."

      );

    }

    return data;

  } catch (error) {

    console.error(

      "Erreur service ajout points étudiants :",

      error

    );

    throw error;

  }

};

