import { apiFetch } from "../../accueils/apiService";

// ============================================================
// ENREGISTRER OU REMPLACER UN MODÈLE DE DOCUMENT
// ============================================================
export const enregistrerModeleDocumentService = async ({
  typeDocument,
  codeMention,
  fichier,
}) => {
  // ==========================================================
  // 1. VALIDATION
  // ==========================================================

  if (!typeDocument || !typeDocument.trim()) {
    throw new Error("Le type de document est obligatoire.");
  }

  if (!codeMention || !codeMention.trim()) {
    throw new Error("Le code de mention est obligatoire.");
  }

  if (!fichier) {
    throw new Error("Le fichier du modèle est obligatoire.");
  }

  const type = typeDocument.trim().toLowerCase();

  const extension = fichier.name
    .split(".")
    .pop()
    .toLowerCase();

  if (!["html", "htm"].includes(extension)) {
    throw new Error(
      "Le fichier doit être au format HTML (.html ou .htm)."
    );
  }

  // ==========================================================
  // 2. DÉTERMINER L'ENDPOINT SELON LE TYPE DE DOCUMENT
  // ==========================================================

  const endpoints = {
    releves: "/administration/modeles-documents-enregistrer-releve",
    attestations:
      "/administration/modeles-documents-enregistrer-attestation",
  };

  const endpoint = endpoints[type];

  if (!endpoint) {
    throw new Error(
      `Type de document non pris en charge : ${typeDocument}.`
    );
  }

  // ==========================================================
  // 3. CONSTRUIRE LE FORMULAIRE MULTIPART
  // ==========================================================

  const formData = new FormData();

  formData.append("typeDocument", type);
  formData.append("codeMention", codeMention.trim());
  formData.append("fichier", fichier);

  // ==========================================================
  // 4. APPEL DU BACKEND
  // ==========================================================

  const response = await apiFetch(endpoint, {
    method: "POST",
    body: formData,
  });

  // ==========================================================
  // 5. LIRE LA RÉPONSE
  // ==========================================================

  const data = await response.json().catch(() => null);

  // ==========================================================
  // 6. GÉRER LES ERREURS
  // ==========================================================

  if (!response.ok || data?.success === false) {
    throw new Error(
      data?.message ||
        "Erreur lors de l'enregistrement du modèle de document."
    );
  }

  // ==========================================================
  // 7. RETOURNER LE RÉSULTAT
  // ==========================================================

  return data;
};

