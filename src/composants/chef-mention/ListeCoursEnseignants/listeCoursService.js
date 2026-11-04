import { apiFetch } from "../../accueils/apiService";

const BASE_URL = "/administration";


/* =====================================================
   Récupérer les années académiques
===================================================== */

export async function getAnneesAcademiques() {
  try {
    const response = await apiFetch(
      `${BASE_URL}/annees-academiques-get-all`,
      {
        method: "GET",
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message:
          data.message ||
          "Erreur lors de la récupération des années académiques.",
      };
    }

    return {
      success: true,
      data: data.data || [],
    };
  } catch (error) {
    console.error(
      "❌ getAnneesAcademiques erreur :",
      error
    );

    return {
      success: false,
      message: "Erreur réseau",
    };
  }
} 

  
/* =========================================================
   Récupérer les affectations des cours d'une mention
   pour une année académique spécifiée
========================================================= */
export async function getAffectationsCoursByMention({
  code_mention,
  libelle_annee
}) {
  try {
    const res = await apiFetch(
      `${BASE_URL}/list-cours-enseign-by-mention/get`,
      {
        method: "POST",
        body: JSON.stringify({
          code_mention,
          libelle_annee
        })
      }
    );

    const data = await res.json();

    if (!res.ok || !data.success) {
      return {
        success: false,
        message:
          data.message ||
          "Erreur lors de la récupération des affectations.",
        data: []
      };
    }

    return {
      success: true,
      message: data.message,
      annee_academique: data.annee_academique,
      data: data.data || []
    };

  } catch (error) {
    console.error(
      "Erreur getAffectationsCoursByMention :",
      error
    );

    return {
      success: false,
      message: "Erreur réseau lors de la récupération des affectations.",
      data: []
    };
  }
}



 // ===============================
 // LISTE DES AFFECTATIONS DES COURS
 // Génération et téléchargement PDF
 // ===============================

export const listeAffectationCoursService = async ({
  code_mention,
  libelle_annee
}) => {
 
  try {

    // ===============================
    // 1. Appeler le backend
    // ===============================

    const response = await apiFetch(
      `${BASE_URL}/list-affectations-cours-enseign-by-mention/get`,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({
          code_mention,
          libelle_annee
        })
      }
    );

    // ===============================
    // 2. Vérifier la réponse
    // ===============================

    if (!response.ok) {

      let message = "Erreur lors de la génération de la liste des affectations.";

      try {
        const data = await response.json();

        message = data.message || message;

      } catch {
        // Réponse d'erreur non JSON
      }

      throw new Error(message);

    }

    // ===============================
    // 3. Récupérer le PDF
    // ===============================

    const blob = await response.blob();

    if (!blob.size) {
      throw new Error("Le fichier PDF généré est vide.");
    }

    // ===============================
    // 4. Créer l'URL temporaire
    // ===============================

    const url = window.URL.createObjectURL(blob);

    // ===============================
    // 5. Télécharger le PDF
    // ===============================

    const a = document.createElement("a");

    a.href = url;

    a.download = `liste-affectations-cours-${libelle_annee}.pdf`;

    document.body.appendChild(a);

    a.click();

    a.remove();

    // ===============================
    // 6. Nettoyer l'URL temporaire
    // ===============================

    window.setTimeout(() => {
      window.URL.revokeObjectURL(url);
    }, 1000);

    return {
      ok: true,
      message: "Liste des affectations téléchargée avec succès."
    };

  } catch (error) {

    console.error(
      "Erreur service liste affectations cours :",
      error
    );

    throw error;

  }

};


