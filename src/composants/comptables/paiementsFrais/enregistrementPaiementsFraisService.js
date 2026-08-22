// src/composants/comptables/paiementsFrais/enregistrementPaiementsFraisService.js

// ============================================================
// CONFIGURATION
// ============================================================

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:8000";


// ============================================================
// MODE SIMULATION
// ============================================================
//
// true  = données simulées
// false = API réelle
//
// Lorsque le backend sera prêt, mettre simplement :
//
// const MODE_SIMULATION = false;
//

const MODE_SIMULATION = true;


// ============================================================
// STATUTS
// ============================================================

export const STATUTS_REFERENCE = {
  VALIDE: "valide",
  EXPIREE: "expiree",
  UTILISEE: "utilisee",
  INVALIDE: "invalide",
};


// ============================================================
// DONNÉES SIMULÉES
// ============================================================

const PAIEMENTS_SIMULES = {

  "PAY-2026-8F4K92": {

    id: 1001,

    reference: "PAY-2026-8F4K92",

    signature_valide: true,

    statut_reference:
      STATUTS_REFERENCE.VALIDE,

    date_expiration:
      "2026-12-31T23:59:59",

    etudiant: {

      id: 501,

      matricule: "UNIKIN-2026-01458",

      nom: "KABAMBA",

      prenom: "Jean",

      nom_complet: "Jean KABAMBA",

      photo: null,

      sexe: "M",

      telephone: "+243 812 345 678",

    },

    faculte:
      "Faculté des Sciences",

    mention:
      "Informatique",

    promotion:
      "L2",

    annee_academique:
      "2025-2026",

    type_frais:
      "FRAIS_ACADEMIQUES",

    libelle_frais:
      "Frais académiques",

    montant_total:
      850000,

    montant_deja_paye:
      500000,

    solde:
      350000,

    devise:
      "FC",

    tranche: {

      id: 701,

      numero: 2,

      libelle:
        "Deuxième tranche",

      montant:
        350000,

      date_echeance:
        "2026-08-31",

    },

    historique: [

      {

        id: 1,

        reference:
          "PAY-2026-1A2B33",

        montant:
          250000,

        mode_paiement:
          "especes",

        date:
          "2026-05-12T10:15:00",

      },

      {

        id: 2,

        reference:
          "PAY-2026-5C7D81",

        montant:
          250000,

        mode_paiement:
          "mobile_money",

        date:
          "2026-06-18T14:42:00",

      },

    ],

    security: {

      signature_valide:
        true,

      qr_authentique:
        true,

      hash:
        "sha256-demo-8f4k92",

    },

  },

};


// ============================================================
// SIMULATION D'UN DÉLAI RÉSEAU
// ============================================================

const attendre = (ms = 800) => {

  return new Promise((resolve) => {

    window.setTimeout(
      resolve,
      ms
    );

  });

};


// ============================================================
// NORMALISATION
// ============================================================

const normaliserPaiement = (
  data,
  referenceParDefaut = ""
) => {

  const source =
    data?.paiement ||
    data?.payment ||
    data?.data ||
    data;


  if (!source) {
    return null;
  }


  return {

    id:
      source.id_paiement ||
      source.id ||
      source.payment_id ||
      null,

    reference:
      source.reference ||
      source.reference_paiement ||
      source.code_reference ||
      referenceParDefaut,

    signatureValide:
      source.signature_valide ??
      source.signatureValid ??
      source.security?.signature_valide ??
      true,

    statutReference:
      source.statut_reference ||
      source.reference_status ||
      STATUTS_REFERENCE.VALIDE,

    expireLe:
      source.date_expiration ||
      source.expire_le ||
      null,

    etudiant: {

      id:
        source.etudiant?.id ||
        source.etudiant_id ||
        null,

      matricule:
        source.etudiant?.matricule ||
        source.matricule ||
        "—",

      nom:
        source.etudiant?.nom ||
        source.nom_etudiant ||
        "Étudiant",

      prenom:
        source.etudiant?.prenom ||
        source.prenom_etudiant ||
        "",

      nomComplet:
        source.etudiant?.nom_complet ||
        source.nom_complet ||
        `${source.etudiant?.prenom || ""} ${source.etudiant?.nom || ""}`.trim() ||
        "Étudiant",

      photo:
        source.etudiant?.photo ||
        source.photo_etudiant ||
        null,

      sexe:
        source.etudiant?.sexe ||
        null,

      telephone:
        source.etudiant?.telephone ||
        null,

    },

    formation: {

      faculte:
        source.faculte ||
        source.etudiant?.faculte ||
        source.code_faculte ||
        "—",

      mention:
        source.mention ||
        source.etudiant?.mention ||
        source.code_mention ||
        "—",

      promotion:
        source.promotion ||
        source.etudiant?.promotion ||
        source.code_promotion ||
        "—",

      annee:
        source.annee_academique ||
        source.annee ||
        "—",

    },

    frais: {

      type:
        source.type_tarif ||
        source.type_frais ||
        source.frais?.type_tarif ||
        "—",

      libelle:
        source.libelle_frais ||
        source.libelle_tarif ||
        source.frais?.libelle ||
        "Frais académiques",

      montantTotal:
        Number(
          source.montant_total ??
          source.montant ??
          source.frais?.montant ??
          0
        ),

      montantDejaPaye:
        Number(
          source.montant_deja_paye ??
          source.deja_paye ??
          source.frais?.montant_deja_paye ??
          0
        ),

      solde:
        Number(
          source.solde ??
          (
            Number(
              source.montant_total ??
              source.montant ??
              0
            ) -
            Number(
              source.montant_deja_paye ??
              source.deja_paye ??
              0
            )
          )
        ),

      devise:
        source.devise ||
        "FC",

    },

    tranche: {

      id:
        source.tranche?.id ||
        source.id_tranche ||
        null,

      numero:
        source.tranche?.numero ||
        source.numero_tranche ||
        null,

      libelle:
        source.tranche?.libelle ||
        source.libelle_tranche ||
        "Tranche",

      montant:
        Number(
          source.tranche?.montant ??
          source.montant_tranche ??
          source.montant_a_payer ??
          source.montant ??
          0
        ),

      dateEcheance:
        source.tranche?.date_echeance ||
        source.date_echeance ||
        null,

    },

    historique:
      Array.isArray(source.historique)
        ? source.historique
        : [],

    securite: {

      signatureValide:
        source.signature_valide ??
        source.security?.signature_valide ??
        true,

      qrAuthentique:
        source.qr_authentique ??
        source.security?.qr_authentique ??
        true,

      hash:
        source.hash_operation ||
        source.security?.hash ||
        null,

    },

  };

};


// ============================================================
// RECHERCHE D'UNE RÉFÉRENCE
// ============================================================

export const rechercherPaiementParReference = async (
  reference
) => {

  const valeur =
    String(reference || "").trim();


  if (!valeur) {

    throw new Error(
      "La référence de paiement est obligatoire."
    );

  }


  // ==========================================================
  // SIMULATION
  // ==========================================================

  if (MODE_SIMULATION) {

    await attendre(900);


    const paiement =
      PAIEMENTS_SIMULES[valeur.toUpperCase()];


    if (!paiement) {

      throw new Error(
        `Aucun paiement trouvé pour la référence "${valeur}".`
      );

    }


    return normaliserPaiement(
      paiement,
      valeur
    );

  }


  // ==========================================================
  // API RÉELLE
  // ==========================================================

  const response =
    await fetch(
      `${API_URL}/api/comptable/paiements-frais/reference/${encodeURIComponent(valeur)}`,
      {
        method: "GET",

        credentials: "include",

        headers: {
          Accept: "application/json",
        },

      }
    );


  const data =
    await response.json().catch(
      () => ({})
    );


  if (!response.ok) {

    throw new Error(
      data?.message ||
      "Cette référence de paiement est introuvable."
    );

  }


  const paiement =
    normaliserPaiement(
      data,
      valeur
    );


  if (!paiement) {

    throw new Error(
      "Les informations du paiement sont invalides."
    );

  }


  return paiement;

};


// ============================================================
// VALIDATION D'UN PAIEMENT
// ============================================================

export const validerPaiementFrais = async ({
  reference,
  montantEncaisse,
  modePaiement,
  confirmationAgent,
}) => {

  if (!reference) {

    throw new Error(
      "La référence du paiement est obligatoire."
    );

  }


  if (!Number.isFinite(
    Number(montantEncaisse)
  )) {

    throw new Error(
      "Le montant encaissé est invalide."
    );

  }


  if (!modePaiement) {

    throw new Error(
      "Le mode de paiement est obligatoire."
    );

  }


  if (!confirmationAgent) {

    throw new Error(
      "La confirmation de l'agent est obligatoire."
    );

  }


  // ==========================================================
  // SIMULATION
  // ==========================================================

  if (MODE_SIMULATION) {

    await attendre(1200);


    return {

      success: true,

      reference_operation:
        reference,

      numero_transaction:
        `TXN-${Date.now()}`,

      date_validation:
        new Date().toISOString(),

      montant_encaisse:
        Number(montantEncaisse),

      mode_paiement:
        modePaiement,

      message:
        "Paiement simulé enregistré avec succès.",

    };

  }


  // ==========================================================
  // API RÉELLE
  // ==========================================================

  const response =
    await fetch(
      `${API_URL}/api/comptable/paiements-frais/valider`,
      {
        method: "POST",

        credentials: "include",

        headers: {

          "Content-Type":
            "application/json",

          Accept:
            "application/json",

        },

        body: JSON.stringify({

          reference,

          montant_encaisse:
            Number(montantEncaisse),

          mode_paiement:
            modePaiement,

          confirmation_agent:
            Boolean(confirmationAgent),

        }),

      }
    );


  const data =
    await response.json().catch(
      () => ({})
    );


  if (!response.ok) {

    throw new Error(
      data?.message ||
      "Impossible de valider le paiement."
    );

  }


  return data;

};


// ============================================================
// EXPORT CONFIGURATION
// ============================================================

export const configurationPaiementsFrais = {

  modeSimulation:
    MODE_SIMULATION,

  apiUrl:
    API_URL,

};
