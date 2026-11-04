import { apiFetch } from "../../accueils/apiService";

// =====================================
// IMPORTER LES ÉTUDIANTS DEPUIS EXCEL
// =====================================
export const importEtudiantsInscrits = async (
  file,
  promotionVersionId
) => {
  if (!file) {
    throw new Error("Aucun fichier sélectionné.");
  }

  if (
    promotionVersionId === undefined ||
    promotionVersionId === null ||
    String(promotionVersionId).trim() === ""
  ) {
    throw new Error("Promotion non sélectionnée.");
  }

  const formData = new FormData();

  formData.append("file", file);

  // Envoyer l'ID de promotions_versions.id_version, jamais le nom.
  formData.append("promotionVersionId", promotionVersionId);

  const response = await apiFetch(
    "/administration/etudiants/inscrits/import",
    {
      method: "POST",
      body: formData
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Erreur lors de l'importation du fichier."
    );
  }

  return data;
};

// =====================================
// CHARGER LES PROMOTIONS PAR MENTION
// =====================================
export const getPromotionsService = async ({ code_mention }) => {
  const response = await apiFetch(
    "/administration/promotions/get",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        code_mention
      })
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Erreur lors du chargement des promotions."
    );
  }

  return data;
};

// =====================================
// INSCRIRE UN ÉTUDIANT MANUELLEMENT
// =====================================
export const inscrireEtudiantService = async ({
  ancienMatricule,
  nom,
  postnom,
  prenom,
  sexe,
  promotionVersionId
}) => {
  if (
    promotionVersionId === undefined ||
    promotionVersionId === null ||
    String(promotionVersionId).trim() === ""
  ) {
    throw new Error("Promotion non sélectionnée.");
  }

  const response = await apiFetch(
    "/administration/etudiant/inscrit",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        ancienMatricule: ancienMatricule.trim().toUpperCase(),
        nom: nom.trim(),
        postnom: postnom.trim(),
        prenom: prenom.trim(),
        sexe,

        // Envoyer l'ID de version, pas nom_promotion.
        promotionVersionId
      })
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
      "Erreur lors de l'inscription de l'étudiant."
    );
  }

  return data;
};


// RÉCUPÉRER LA LISTE DES ETUDIANTS permettant  l'activation de leurs comptes,
//  pour une mention spécifiée
export const listeEtudiantsInscritsParMentionService = async ({
  codeMention
}) => {

  try {

    // ===============================
    // 1. Appeler le backend
    // ===============================

    const response = await apiFetch(
      "/administration/list-etudiants-inscrits-by-mention-by-annee-encours/get",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({
          codeMention
        })
      }
    );

    // ===============================
    // 2. Vérifier la réponse
    // ===============================

    if (!response.ok) {

      let message =
        "Erreur lors de la génération de la liste des étudiants inscrits.";

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

    a.download = `liste-etudiants-inscrits-${codeMention}.pdf`;

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
      message: "Liste des étudiants inscrits téléchargée avec succès."
    };

  } catch (error) {

    console.error(
      "Erreur service liste étudiants inscrits par mention :",
      error
    );

    throw error;

  }

};
