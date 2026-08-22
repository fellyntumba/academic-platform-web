import React, {
  useMemo,
  useState,
} from "react";

import "./SituationsFinancieres.css";

// ============================================================
// CONFIGURATION
// ============================================================

const ANNEE_ACADEMIQUE_COURANTE = (() => {
  const maintenant = new Date();
  const annee = maintenant.getFullYear();
  const mois = maintenant.getMonth() + 1;

  return mois >= 9
    ? `${annee}-${annee + 1}`
    : `${annee - 1}-${annee}`;
})();

const ANNEES_ACADEMIQUES = [
  ANNEE_ACADEMIQUE_COURANTE,
  "2025-2026",
  "2024-2025",
  "2023-2024",
];

const PROMOTIONS = [
  {
    id: "l1-info",
    code: "L1",
    libelle: "Licence 1 — Informatique",
    faculte: "Faculté des Sciences",
    mention: "Informatique",
  },
  {
    id: "l2-info",
    code: "L2",
    libelle: "Licence 2 — Informatique",
    faculte: "Faculté des Sciences",
    mention: "Informatique",
  },
  {
    id: "l3-info",
    code: "L3",
    libelle: "Licence 3 — Informatique",
    faculte: "Faculté des Sciences",
    mention: "Informatique",
  },
  {
    id: "l1-gestion",
    code: "L1",
    libelle: "Licence 1 — Sciences de Gestion",
    faculte: "Faculté des Sciences Économiques",
    mention: "Sciences de Gestion",
  },
  {
    id: "l2-gestion",
    code: "L2",
    libelle: "Licence 2 — Sciences de Gestion",
    faculte: "Faculté des Sciences Économiques",
    mention: "Sciences de Gestion",
  },
];

// ============================================================
// DONNÉES DE DÉMONSTRATION
// ============================================================

const ETUDIANTS_DEMO = [
  {
    id: 1,
    matricule: "UNIKIN-2026-01458",
    nom: "KABAMBA",
    prenom: "Jean",
    promotionId: "l2-info",
    promotion: "L2",
    faculte: "Faculté des Sciences",
    mention: "Informatique",
    annee: "2025-2026",
    montantFacture: 850000,
    montantPaye: 850000,
    devise: "FC",
    paiements: [
      {
        id: 101,
        reference: "PAY-2026-1A2B33",
        date: "2026-05-12T10:15:00",
        libelle: "Première tranche",
        montant: 500000,
        mode: "Espèces",
        statut: "valide",
      },
      {
        id: 102,
        reference: "PAY-2026-5C7D81",
        date: "2026-06-18T14:42:00",
        libelle: "Deuxième tranche",
        montant: 350000,
        mode: "Mobile Money",
        statut: "valide",
      },
    ],
  },

  {
    id: 2,
    matricule: "UNIKIN-2026-01721",
    nom: "MUKENDI",
    prenom: "Sarah",
    promotionId: "l2-info",
    promotion: "L2",
    faculte: "Faculté des Sciences",
    mention: "Informatique",
    annee: "2025-2026",
    montantFacture: 850000,
    montantPaye: 600000,
    devise: "FC",
    paiements: [
      {
        id: 201,
        reference: "PAY-2026-7D4K91",
        date: "2026-05-22T09:30:00",
        libelle: "Première tranche",
        montant: 400000,
        mode: "Virement",
        statut: "valide",
      },
      {
        id: 202,
        reference: "PAY-2026-8L2M43",
        date: "2026-07-10T11:20:00",
        libelle: "Deuxième tranche",
        montant: 200000,
        mode: "Mobile Money",
        statut: "valide",
      },
    ],
  },

  {
    id: 3,
    matricule: "UNIKIN-2026-01894",
    nom: "TSHIMANGA",
    prenom: "David",
    promotionId: "l2-info",
    promotion: "L2",
    faculte: "Faculté des Sciences",
    mention: "Informatique",
    annee: "2025-2026",
    montantFacture: 850000,
    montantPaye: 300000,
    devise: "FC",
    paiements: [
      {
        id: 301,
        reference: "PAY-2026-2K9P61",
        date: "2026-06-02T15:10:00",
        libelle: "Première tranche",
        montant: 300000,
        mode: "Espèces",
        statut: "valide",
      },
    ],
  },

  {
    id: 4,
    matricule: "UNIKIN-2026-01982",
    nom: "KASONGO",
    prenom: "Grace",
    promotionId: "l2-info",
    promotion: "L2",
    faculte: "Faculté des Sciences",
    mention: "Informatique",
    annee: "2025-2026",
    montantFacture: 850000,
    montantPaye: 850000,
    devise: "FC",
    paiements: [
      {
        id: 401,
        reference: "PAY-2026-4F1T22",
        date: "2026-04-15T08:40:00",
        libelle: "Première tranche",
        montant: 450000,
        mode: "Virement",
        statut: "valide",
      },
      {
        id: 402,
        reference: "PAY-2026-9R3Q11",
        date: "2026-07-25T13:10:00",
        libelle: "Deuxième tranche",
        montant: 400000,
        mode: "Virement",
        statut: "valide",
      },
    ],
  },

  {
    id: 5,
    matricule: "UNIKIN-2026-02103",
    nom: "KALUME",
    prenom: "Patrick",
    promotionId: "l2-info",
    promotion: "L2",
    faculte: "Faculté des Sciences",
    mention: "Informatique",
    annee: "2025-2026",
    montantFacture: 850000,
    montantPaye: 0,
    devise: "FC",
    paiements: [],
  },

  {
    id: 6,
    matricule: "UNIKIN-2026-02154",
    nom: "MABIALA",
    prenom: "Esther",
    promotionId: "l1-info",
    promotion: "L1",
    faculte: "Faculté des Sciences",
    mention: "Informatique",
    annee: "2025-2026",
    montantFacture: 750000,
    montantPaye: 750000,
    devise: "FC",
    paiements: [
      {
        id: 601,
        reference: "PAY-2026-3J8A42",
        date: "2026-05-03T12:30:00",
        libelle: "Paiement complet",
        montant: 750000,
        mode: "Mobile Money",
        statut: "valide",
      },
    ],
  },

  {
    id: 7,
    matricule: "UNIKIN-2026-02214",
    nom: "ILUNGA",
    prenom: "Jonathan",
    promotionId: "l3-info",
    promotion: "L3",
    faculte: "Faculté des Sciences",
    mention: "Informatique",
    annee: "2025-2026",
    montantFacture: 900000,
    montantPaye: 500000,
    devise: "FC",
    paiements: [
      {
        id: 701,
        reference: "PAY-2026-6P8W12",
        date: "2026-04-21T10:00:00",
        libelle: "Première tranche",
        montant: 500000,
        mode: "Virement",
        statut: "valide",
      },
    ],
  },

  {
    id: 8,
    matricule: "UNIKIN-2026-02301",
    nom: "MULUMBA",
    prenom: "Alice",
    promotionId: "l3-info",
    promotion: "L3",
    faculte: "Faculté des Sciences",
    mention: "Informatique",
    annee: "2025-2026",
    montantFacture: 900000,
    montantPaye: 900000,
    devise: "FC",
    paiements: [
      {
        id: 801,
        reference: "PAY-2026-7H2N44",
        date: "2026-04-17T09:20:00",
        libelle: "Première tranche",
        montant: 450000,
        mode: "Espèces",
        statut: "valide",
      },
      {
        id: 802,
        reference: "PAY-2026-1X5B91",
        date: "2026-07-12T16:05:00",
        libelle: "Deuxième tranche",
        montant: 450000,
        mode: "Mobile Money",
        statut: "valide",
      },
    ],
  },
];

// ============================================================
// UTILITAIRES
// ============================================================

const formatMontant = (
  montant,
  devise = "FC"
) => {
  const nombre = Number(montant);

  if (!Number.isFinite(nombre)) {
    return `0 ${devise}`;
  }

  return `${new Intl.NumberFormat(
    "fr-FR"
  ).format(nombre)} ${devise}`;
};

const formatNombre = (nombre) => {
  return new Intl.NumberFormat(
    "fr-FR"
  ).format(Number(nombre) || 0);
};

const formatDate = (date) => {
  if (!date) {
    return "—";
  }

  const valeur = new Date(date);

  if (
    Number.isNaN(
      valeur.getTime()
    )
  ) {
    return String(date);
  }

  return new Intl.DateTimeFormat(
    "fr-FR",
    {
      dateStyle: "medium",
    }
  ).format(valeur);
};

const formatDateHeure = (date) => {
  if (!date) {
    return "—";
  }

  const valeur = new Date(date);

  if (
    Number.isNaN(
      valeur.getTime()
    )
  ) {
    return String(date);
  }

  return new Intl.DateTimeFormat(
    "fr-FR",
    {
      dateStyle: "medium",
      timeStyle: "short",
    }
  ).format(valeur);
};

const getInitiales = (etudiant) => {
  if (!etudiant) {
    return "ET";
  }

  return (
    `${etudiant.prenom?.charAt(0) || ""}${
      etudiant.nom?.charAt(0) || ""
    }`
      .toUpperCase()
      .trim() || "ET"
  );
};

const getStatutFinancier = (etudiant) => {
  const facture =
    Number(etudiant.montantFacture) || 0;

  const paye =
    Number(etudiant.montantPaye) || 0;

  if (paye <= 0) {
    return "impaye";
  }

  if (paye >= facture) {
    return "solde";
  }

  return "partiel";
};

const getStatutLabel = (statut) => {
  const labels = {
    solde: "À jour",
    partiel: "Paiement partiel",
    impaye: "Impayé",
  };

  return labels[statut] || "Inconnu";
};

// ============================================================
// COMPOSANT
// ============================================================

const SituationsFinancieres = () => {
  // ==========================================================
  // VUE
  // ==========================================================

  const [vue, setVue] =
    useState("promotion");

  // ==========================================================
  // FILTRES PROMOTION
  // ==========================================================

  const [anneeAcademique, setAnneeAcademique] =
    useState(ANNEE_ACADEMIQUE_COURANTE);

  const [promotionId, setPromotionId] =
    useState("l2-info");

  const [recherchePromotion, setRecherchePromotion] =
    useState("");

  // ==========================================================
  // RECHERCHE ÉTUDIANT
  // ==========================================================

  const [rechercheEtudiant, setRechercheEtudiant] =
    useState("");

  const [etudiantSelectionne, setEtudiantSelectionne] =
    useState(null);

  // ==========================================================
  // FILTRES TABLEAU
  // ==========================================================

  const [filtreStatut, setFiltreStatut] =
    useState("tous");

  const [tri, setTri] =
    useState("nom");

  // ==========================================================
  // PROMOTION SÉLECTIONNÉE
  // ==========================================================

  const promotionSelectionnee =
    useMemo(() => {
      return (
        PROMOTIONS.find(
          (promotion) =>
            promotion.id === promotionId
        ) ||
        PROMOTIONS[0]
      );
    }, [promotionId]);

  // ==========================================================
  // DONNÉES DE LA PROMOTION
  // ==========================================================

  const etudiantsPromotion =
    useMemo(() => {
      return ETUDIANTS_DEMO.filter(
        (etudiant) =>
          etudiant.promotionId ===
            promotionId &&
          etudiant.annee ===
            "2025-2026"
      );
    }, [promotionId]);

  // ==========================================================
  // STATISTIQUES PROMOTION
  // ==========================================================

  const statistiquesPromotion =
    useMemo(() => {
      const effectif =
        etudiantsPromotion.length;

      const facture =
        etudiantsPromotion.reduce(
          (total, etudiant) =>
            total +
            Number(
              etudiant.montantFacture
            ),
          0
        );

      const paye =
        etudiantsPromotion.reduce(
          (total, etudiant) =>
            total +
            Number(
              etudiant.montantPaye
            ),
          0
        );

      const solde =
        Math.max(
          0,
          facture - paye
        );

      const aJour =
        etudiantsPromotion.filter(
          (etudiant) =>
            getStatutFinancier(
              etudiant
            ) === "solde"
        ).length;

      const partiels =
        etudiantsPromotion.filter(
          (etudiant) =>
            getStatutFinancier(
              etudiant
            ) === "partiel"
        ).length;

      const impayes =
        etudiantsPromotion.filter(
          (etudiant) =>
            getStatutFinancier(
              etudiant
            ) === "impaye"
        ).length;

      const taux =
        facture > 0
          ? (paye / facture) * 100
          : 0;

      return {
        effectif,
        facture,
        paye,
        solde,
        aJour,
        partiels,
        impayes,
        taux,
      };
    }, [etudiantsPromotion]);

  // ==========================================================
  // ÉTUDIANTS FILTRÉS
  // ==========================================================

  const etudiantsFiltres =
    useMemo(() => {
      const recherche =
        recherchePromotion
          .trim()
          .toLowerCase();

      const resultat =
        etudiantsPromotion.filter(
          (etudiant) => {
            const correspondRecherche =
              !recherche ||
              [
                etudiant.nom,
                etudiant.prenom,
                etudiant.matricule,
              ]
                .join(" ")
                .toLowerCase()
                .includes(recherche);

            const statut =
              getStatutFinancier(
                etudiant
              );

            const correspondStatut =
              filtreStatut === "tous" ||
              statut === filtreStatut;

            return (
              correspondRecherche &&
              correspondStatut
            );
          }
        );

      return [...resultat].sort(
        (a, b) => {
          if (tri === "nom") {
            return `${a.nom} ${a.prenom}`.localeCompare(
              `${b.nom} ${b.prenom}`,
              "fr"
            );
          }

          if (tri === "solde") {
            return (
              b.montantFacture -
              b.montantPaye -
              (a.montantFacture -
                a.montantPaye)
            );
          }

          if (tri === "paye") {
            return (
              b.montantPaye -
              a.montantPaye
            );
          }

          return 0;
        }
      );
    }, [
      etudiantsPromotion,
      recherchePromotion,
      filtreStatut,
      tri,
    ]);

  // ==========================================================
  // RECHERCHE ÉTUDIANT
  // ==========================================================

  const resultatsEtudiants =
    useMemo(() => {
      const recherche =
        rechercheEtudiant
          .trim()
          .toLowerCase();

      if (!recherche) {
        return [];
      }

      return ETUDIANTS_DEMO.filter(
        (etudiant) =>
          [
            etudiant.nom,
            etudiant.prenom,
            etudiant.matricule,
          ]
            .join(" ")
            .toLowerCase()
            .includes(recherche)
      ).slice(0, 8);
    }, [rechercheEtudiant]);

  // ==========================================================
  // ÉTUDIANT COURANT
  // ==========================================================

  const situationEtudiant =
    useMemo(() => {
      if (!etudiantSelectionne) {
        return null;
      }

      const facture =
        Number(
          etudiantSelectionne.montantFacture
        );

      const paye =
        Number(
          etudiantSelectionne.montantPaye
        );

      const solde =
        Math.max(
          0,
          facture - paye
        );

      const taux =
        facture > 0
          ? (paye / facture) * 100
          : 0;

      return {
        facture,
        paye,
        solde,
        taux,
        statut:
          getStatutFinancier(
            etudiantSelectionne
          ),
      };
    }, [etudiantSelectionne]);

  // ==========================================================
  // ACTIONS
  // ==========================================================

  const imprimer = () => {
    window.print();
  };

  const selectionnerEtudiant = (
    etudiant
  ) => {
    setEtudiantSelectionne(etudiant);
    setRechercheEtudiant(
      `${etudiant.prenom} ${etudiant.nom}`
    );
  };

  const ouvrirSituationEtudiant = (
    etudiant
  ) => {
    selectionnerEtudiant(etudiant);
    setVue("etudiant");
  };

  const effacerRechercheEtudiant = () => {
    setRechercheEtudiant("");
    setEtudiantSelectionne(null);
  };

  // ==========================================================
  // RENDU
  // ==========================================================

  return (
    <section className="situations-financieres-container">

      {/* ======================================================
          HEADER
      ====================================================== */}

      <header className="sf-page-header">

        <div className="sf-header-copy">

          <span className="sf-eyebrow">
            Comptabilité / Finance
          </span>

          <h1>
            Situations financières
          </h1>

          <p>
            Consultez, analysez et imprimez
            la situation financière d'une
            promotion ou l'historique complet
            d'un étudiant.
          </p>

        </div>

        <div className="sf-header-actions">

          <div className="sf-secure-indicator">
            <span className="sf-secure-dot" />

            <div>
              <strong>
                Données financières
              </strong>

              <small>
                Consultation sécurisée
              </small>
            </div>
          </div>

          <button
            type="button"
            className="sf-print-button"
            onClick={imprimer}
          >
            <span>↗</span>
            Imprimer
          </button>

        </div>

      </header>

      {/* ======================================================
          NAVIGATION DES VUES
      ====================================================== */}

      <nav className="sf-view-switcher">

        <button
          type="button"
          className={
            vue === "promotion"
              ? "active"
              : ""
          }
          onClick={() => setVue("promotion")}
        >
          <span className="sf-view-icon">
            ▦
          </span>

          <span>
            <strong>
              Situation promotion
            </strong>

            <small>
              Vue globale et recouvrement
            </small>
          </span>
        </button>

        <button
          type="button"
          className={
            vue === "etudiant"
              ? "active"
              : ""
          }
          onClick={() => setVue("etudiant")}
        >
          <span className="sf-view-icon">
            ◎
          </span>

          <span>
            <strong>
              Situation étudiant
            </strong>

            <small>
              Historique individuel
            </small>
          </span>
        </button>

      </nav>

      {/* ======================================================
          VUE PROMOTION
      ====================================================== */}

      {vue === "promotion" && (
        <div className="sf-promotion-view">

          {/* ==================================================
              FILTRES
          ================================================== */}

          <div className="sf-filter-card">

            <div className="sf-filter-heading">

              <div className="sf-filter-symbol">
                ≡
              </div>

              <div>
                <span>
                  PARAMÈTRES DE CONSULTATION
                </span>

                <h2>
                  Sélectionner une situation
                </h2>
              </div>

            </div>

            <div className="sf-filter-fields">

              <div className="sf-field">

                <label htmlFor="sf-annee">
                  Année académique
                </label>

                <select
                  id="sf-annee"
                  value={anneeAcademique}
                  onChange={(event) =>
                    setAnneeAcademique(
                      event.target.value
                    )
                  }
                >
                  {ANNEES_ACADEMIQUES.map(
                    (annee) => (
                      <option
                        key={annee}
                        value={annee}
                      >
                        {annee}
                      </option>
                    )
                  )}
                </select>

              </div>

              <div className="sf-field sf-field-promotion">

                <label htmlFor="sf-promotion">
                  Promotion
                </label>

                <select
                  id="sf-promotion"
                  value={promotionId}
                  onChange={(event) =>
                    setPromotionId(
                      event.target.value
                    )
                  }
                >
                  {PROMOTIONS.map(
                    (promotion) => (
                      <option
                        key={promotion.id}
                        value={promotion.id}
                      >
                        {promotion.libelle}
                      </option>
                    )
                  )}
                </select>

              </div>

              <div className="sf-field sf-field-search">

                <label htmlFor="sf-search-promotion">
                  Rechercher un étudiant
                </label>

                <div className="sf-input-with-icon">

                  <span>
                    ⌕
                  </span>

                  <input
                    id="sf-search-promotion"
                    type="search"
                    value={recherchePromotion}
                    onChange={(event) =>
                      setRecherchePromotion(
                        event.target.value
                      )
                    }
                    placeholder="Nom, prénom ou matricule..."
                  />

                </div>

              </div>

            </div>

            <div className="sf-current-context">

              <span className="sf-context-check">
                ✓
              </span>

              <span>
                Situation affichée :
              </span>

              <strong>
                {promotionSelectionnee.libelle}
              </strong>

              <span>
                ·
              </span>

              <strong>
                {anneeAcademique}
              </strong>

            </div>

          </div>

          {/* ==================================================
              TITRE DOCUMENT
          ================================================== */}

          <div className="sf-document-heading">

            <div>

              <span>
                ÉTAT FINANCIER
              </span>

              <h2>
                {promotionSelectionnee.libelle}
              </h2>

              <p>
                {promotionSelectionnee.faculte}
                {" · "}
                {promotionSelectionnee.mention}
                {" · "}
                Année académique{" "}
                {anneeAcademique}
              </p>

            </div>

            <div className="sf-document-meta">
              <span>
                Généré le
              </span>

              <strong>
                {formatDate(
                  new Date()
                )}
              </strong>
            </div>

          </div>

          {/* ==================================================
              KPI
          ================================================== */}

          <div className="sf-kpi-grid">

            <article className="sf-kpi-card">

              <div className="sf-kpi-icon blue">
                ◉
              </div>

              <div className="sf-kpi-content">

                <span>
                  Effectif
                </span>

                <strong>
                  {formatNombre(
                    statistiquesPromotion.effectif
                  )}
                </strong>

                <small>
                  étudiants
                </small>

              </div>

            </article>

            <article className="sf-kpi-card">

              <div className="sf-kpi-icon violet">
                ◇
              </div>

              <div className="sf-kpi-content">

                <span>
                  Montant facturé
                </span>

                <strong>
                  {formatMontant(
                    statistiquesPromotion.facture
                  )}
                </strong>

                <small>
                  total de la promotion
                </small>

              </div>

            </article>

            <article className="sf-kpi-card">

              <div className="sf-kpi-icon green">
                ✓
              </div>

              <div className="sf-kpi-content">

                <span>
                  Montant encaissé
                </span>

                <strong>
                  {formatMontant(
                    statistiquesPromotion.paye
                  )}
                </strong>

                <small>
                  paiements enregistrés
                </small>

              </div>

            </article>

            <article className="sf-kpi-card">

              <div className="sf-kpi-icon orange">
                !
              </div>

              <div className="sf-kpi-content">

                <span>
                  Solde à recouvrer
                </span>

                <strong>
                  {formatMontant(
                    statistiquesPromotion.solde
                  )}
                </strong>

                <small>
                  reste à payer
                </small>

              </div>

            </article>

          </div>

          {/* ==================================================
              RECOUVREMENT
          ================================================== */}

          <div className="sf-overview-grid">

            <article className="sf-recovery-card">

              <div className="sf-card-topline">

                <div>

                  <span>
                    TAUX DE RECOUVREMENT
                  </span>

                  <h3>
                    Progression financière
                  </h3>

                </div>

                <strong className="sf-recovery-percentage">
                  {statistiquesPromotion.taux.toFixed(
                    1
                  )}
                  %
                </strong>

              </div>

              <div className="sf-progress">

                <div
                  className="sf-progress-value"
                  style={{
                    width: `${Math.min(
                      statistiquesPromotion.taux,
                      100
                    )}%`,
                  }}
                />

              </div>

              <div className="sf-recovery-footer">

                <span>
                  {formatMontant(
                    statistiquesPromotion.paye
                  )}{" "}
                  encaissés
                </span>

                <strong>
                  sur{" "}
                  {formatMontant(
                    statistiquesPromotion.facture
                  )}
                </strong>

              </div>

            </article>

            <article className="sf-status-card">

              <div className="sf-card-topline">

                <div>

                  <span>
                    SITUATION DES ÉTUDIANTS
                  </span>

                  <h3>
                    État du recouvrement
                  </h3>

                </div>

              </div>

              <div className="sf-status-grid">

                <button
                  type="button"
                  className={
                    filtreStatut === "solde"
                      ? "sf-status-item active"
                      : "sf-status-item"
                  }
                  onClick={() =>
                    setFiltreStatut(
                      filtreStatut === "solde"
                        ? "tous"
                        : "solde"
                    )
                  }
                >
                  <span className="sf-status-dot green" />

                  <strong>
                    {statistiquesPromotion.aJour}
                  </strong>

                  <small>
                    À jour
                  </small>
                </button>

                <button
                  type="button"
                  className={
                    filtreStatut === "partiel"
                      ? "sf-status-item active"
                      : "sf-status-item"
                  }
                  onClick={() =>
                    setFiltreStatut(
                      filtreStatut === "partiel"
                        ? "tous"
                        : "partiel"
                    )
                  }
                >
                  <span className="sf-status-dot orange" />

                  <strong>
                    {statistiquesPromotion.partiels}
                  </strong>

                  <small>
                    Partiels
                  </small>
                </button>

                <button
                  type="button"
                  className={
                    filtreStatut === "impaye"
                      ? "sf-status-item active"
                      : "sf-status-item"
                  }
                  onClick={() =>
                    setFiltreStatut(
                      filtreStatut === "impaye"
                        ? "tous"
                        : "impaye"
                    )
                  }
                >
                  <span className="sf-status-dot red" />

                  <strong>
                    {statistiquesPromotion.impayes}
                  </strong>

                  <small>
                    Impayés
                  </small>
                </button>

              </div>

            </article>

          </div>

          {/* ==================================================
              TABLEAU
          ================================================== */}

          <article className="sf-table-card">

            <div className="sf-table-header">

              <div>

                <span>
                  DÉTAIL DES ÉTUDIANTS
                </span>

                <h3>
                  Situation individuelle
                </h3>

              </div>

              <div className="sf-table-tools">

                <select
                  value={tri}
                  onChange={(event) =>
                    setTri(
                      event.target.value
                    )
                  }
                  aria-label="Trier les étudiants"
                >
                  <option value="nom">
                    Trier par nom
                  </option>

                  <option value="solde">
                    Trier par solde
                  </option>

                  <option value="paye">
                    Trier par montant payé
                  </option>
                </select>

                <button
                  type="button"
                  className="sf-small-print"
                  onClick={imprimer}
                >
                  Imprimer
                </button>

              </div>

            </div>

            <div className="sf-table-wrapper">

              <table className="sf-financial-table">

                <thead>

                  <tr>

                    <th>
                      Étudiant
                    </th>

                    <th>
                      Matricule
                    </th>

                    <th>
                      Montant facturé
                    </th>

                    <th>
                      Déjà payé
                    </th>

                    <th>
                      Solde
                    </th>

                    <th>
                      État
                    </th>

                    <th>
                      <span className="sf-sr-only">
                        Actions
                      </span>
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {etudiantsFiltres.map(
                    (etudiant) => {

                      const statut =
                        getStatutFinancier(
                          etudiant
                        );

                      const solde =
                        Math.max(
                          0,
                          etudiant.montantFacture -
                          etudiant.montantPaye
                        );

                      return (
                        <tr
                          key={etudiant.id}
                        >

                          <td>

                            <div className="sf-student-cell">

                              <div className="sf-avatar">
                                {getInitiales(
                                  etudiant
                                )}
                              </div>

                              <div>

                                <strong>
                                  {etudiant.prenom}{" "}
                                  {etudiant.nom}
                                </strong>

                                <small>
                                  {etudiant.mention}
                                </small>

                              </div>

                            </div>

                          </td>

                          <td>
                            <span className="sf-matricule">
                              {etudiant.matricule}
                            </span>
                          </td>

                          <td>
                            <strong>
                              {formatMontant(
                                etudiant.montantFacture
                              )}
                            </strong>
                          </td>

                          <td>
                            <span className="sf-paid-amount">
                              {formatMontant(
                                etudiant.montantPaye
                              )}
                            </span>
                          </td>

                          <td>
                            <strong
                              className={
                                solde > 0
                                  ? "sf-balance warning"
                                  : "sf-balance"
                              }
                            >
                              {formatMontant(
                                solde
                              )}
                            </strong>
                          </td>

                          <td>

                            <span
                              className={`sf-status-badge ${statut}`}
                            >
                              <span />
                              {getStatutLabel(
                                statut
                              )}
                            </span>

                          </td>

                          <td>

                            <button
                              type="button"
                              className="sf-row-action"
                              onClick={() =>
                                ouvrirSituationEtudiant(
                                  etudiant
                                )
                              }
                            >
                              Voir
                              <span>
                                →
                              </span>
                            </button>

                          </td>

                        </tr>
                      );
                    }
                  )}

                </tbody>

              </table>

              {etudiantsFiltres.length === 0 && (

                <div className="sf-empty-state">

                  <div>
                    ⌕
                  </div>

                  <h3>
                    Aucun étudiant trouvé
                  </h3>

                  <p>
                    Modifiez votre recherche
                    ou votre filtre de situation.
                  </p>

                </div>

              )}

            </div>

            <div className="sf-table-footer">

              <span>
                Affichage de{" "}
                <strong>
                  {etudiantsFiltres.length}
                </strong>{" "}
                étudiant(s)
              </span>

              <span>
                Solde total :{" "}
                <strong>
                  {formatMontant(
                    statistiquesPromotion.solde
                  )}
                </strong>
              </span>

            </div>

          </article>

        </div>
      )}

      {/* ======================================================
          VUE ÉTUDIANT
      ====================================================== */}

      {vue === "etudiant" && (

        <div className="sf-student-view">

          {/* ==================================================
              RECHERCHE
          ================================================== */}

          <div className="sf-student-search-card">

            <div className="sf-search-heading">

              <div className="sf-search-icon">
                ⌕
              </div>

              <div>

                <span>
                  RECHERCHE INDIVIDUELLE
                </span>

                <h2>
                  Rechercher un étudiant
                </h2>

                <p>
                  Utilisez le matricule,
                  le nom ou le prénom.
                </p>

              </div>

            </div>

            <div className="sf-student-search-input">

              <span>
                ⌕
              </span>

              <input
                type="search"
                value={rechercheEtudiant}
                onChange={(event) =>
                  setRechercheEtudiant(
                    event.target.value
                  )
                }
                placeholder="Ex. UNIKIN-2026-01458 ou Jean Kabamba"
                autoComplete="off"
              />

              {rechercheEtudiant && (
                <button
                  type="button"
                  onClick={
                    effacerRechercheEtudiant
                  }
                  aria-label="Effacer la recherche"
                >
                  ×
                </button>
              )}

            </div>

            {resultatsEtudiants.length > 0 && (

              <div className="sf-search-results">

                {resultatsEtudiants.map(
                  (etudiant) => (

                    <button
                      type="button"
                      key={etudiant.id}
                      className="sf-search-result"
                      onClick={() =>
                        selectionnerEtudiant(
                          etudiant
                        )
                      }
                    >

                      <div className="sf-avatar">
                        {getInitiales(
                          etudiant
                        )}
                      </div>

                      <div>

                        <strong>
                          {etudiant.prenom}{" "}
                          {etudiant.nom}
                        </strong>

                        <span>
                          {etudiant.matricule}
                          {" · "}
                          {etudiant.promotion}
                        </span>

                      </div>

                      <span className="sf-result-arrow">
                        →
                      </span>

                    </button>

                  )
                )}

              </div>

            )}

          </div>

          {/* ==================================================
              SITUATION ÉTUDIANT
          ================================================== */}

          {etudiantSelectionne &&
            situationEtudiant && (

            <>

              <div className="sf-student-document-heading">

                <div>

                  <span>
                    SITUATION FINANCIÈRE INDIVIDUELLE
                  </span>

                  <h2>
                    Historique financier
                  </h2>

                  <p>
                    Année académique{" "}
                    {etudiantSelectionne.annee}
                  </p>

                </div>

                <button
                  type="button"
                  className="sf-print-button"
                  onClick={imprimer}
                >
                  <span>
                    ↗
                  </span>
                  Imprimer la situation
                </button>

              </div>

              {/* ==============================================
                  IDENTITÉ
              ============================================== */}

              <article className="sf-student-profile-card">

                <div className="sf-profile-main">

                  <div className="sf-large-avatar">
                    {getInitiales(
                      etudiantSelectionne
                    )}
                  </div>

                  <div className="sf-profile-identity">

                    <span>
                      ÉTUDIANT
                    </span>

                    <h2>
                      {
                        etudiantSelectionne.prenom
                      }{" "}
                      {
                        etudiantSelectionne.nom
                      }
                    </h2>

                    <strong>
                      {
                        etudiantSelectionne.matricule
                      }
                    </strong>

                  </div>

                  <span
                    className={`sf-profile-status ${situationEtudiant.statut}`}
                  >
                    <span />
                    {getStatutLabel(
                      situationEtudiant.statut
                    )}
                  </span>

                </div>

                <div className="sf-profile-details">

                  <div>
                    <span>
                      Faculté
                    </span>

                    <strong>
                      {
                        etudiantSelectionne.faculte
                      }
                    </strong>
                  </div>

                  <div>
                    <span>
                      Mention
                    </span>

                    <strong>
                      {
                        etudiantSelectionne.mention
                      }
                    </strong>
                  </div>

                  <div>
                    <span>
                      Promotion
                    </span>

                    <strong>
                      {
                        etudiantSelectionne.promotion
                      }
                    </strong>
                  </div>

                  <div>
                    <span>
                      Année académique
                    </span>

                    <strong>
                      {
                        etudiantSelectionne.annee
                      }
                    </strong>
                  </div>

                </div>

              </article>

              {/* ==============================================
                  KPI ÉTUDIANT
              ============================================== */}

              <div className="sf-student-kpis">

                <article>
                  <span>
                    Total facturé
                  </span>

                  <strong>
                    {formatMontant(
                      situationEtudiant.facture,
                      etudiantSelectionne.devise
                    )}
                  </strong>
                </article>

                <article className="success">
                  <span>
                    Total payé
                  </span>

                  <strong>
                    {formatMontant(
                      situationEtudiant.paye,
                      etudiantSelectionne.devise
                    )}
                  </strong>
                </article>

                <article className="warning">
                  <span>
                    Solde restant
                  </span>

                  <strong>
                    {formatMontant(
                      situationEtudiant.solde,
                      etudiantSelectionne.devise
                    )}
                  </strong>
                </article>

                <article className="progress-kpi">
                  <span>
                    Taux de paiement
                  </span>

                  <strong>
                    {situationEtudiant.taux.toFixed(
                      1
                    )}
                    %
                  </strong>

                  <div className="sf-mini-progress">
                    <div
                      style={{
                        width: `${Math.min(
                          situationEtudiant.taux,
                          100
                        )}%`,
                      }}
                    />
                  </div>
                </article>

              </div>

              {/* ==============================================
                  HISTORIQUE
              ============================================== */}

              <article className="sf-history-card">

                <div className="sf-history-header">

                  <div>

                    <span>
                      HISTORIQUE DES OPÉRATIONS
                    </span>

                    <h3>
                      Paiements enregistrés
                    </h3>

                  </div>

                  <span className="sf-operation-count">
                    {
                      etudiantSelectionne.paiements
                        .length
                    }{" "}
                    opération(s)
                  </span>

                </div>

                {etudiantSelectionne.paiements
                  .length > 0 ? (

                  <div className="sf-history-list">

                    {etudiantSelectionne.paiements
                      .map(
                        (
                          paiement,
                          index
                        ) => (

                          <div
                            className="sf-history-item"
                            key={
                              paiement.id
                            }
                          >

                            <div className="sf-history-index">
                              {String(
                                index + 1
                              ).padStart(
                                2,
                                "0"
                              )}
                            </div>

                            <div className="sf-history-date">
                              <strong>
                                {formatDate(
                                  paiement.date
                                )}
                              </strong>

                              <span>
                                {formatDateHeure(
                                  paiement.date
                                )}
                              </span>
                            </div>

                            <div className="sf-history-description">

                              <strong>
                                {
                                  paiement.libelle
                                }
                              </strong>

                              <span>
                                Réf.{" "}
                                {
                                  paiement.reference
                                }
                              </span>

                            </div>

                            <div className="sf-history-method">
                              <span>
                                Mode
                              </span>

                              <strong>
                                {
                                  paiement.mode
                                }
                              </strong>
                            </div>

                            <div className="sf-history-amount">
                              <strong>
                                +{" "}
                                {formatMontant(
                                  paiement.montant,
                                  etudiantSelectionne.devise
                                )}
                              </strong>

                              <span className="sf-payment-valid">
                                ✓ Enregistré
                              </span>
                            </div>

                          </div>

                        )
                      )}

                  </div>

                ) : (

                  <div className="sf-no-payments">

                    <div>
                      —
                    </div>

                    <h3>
                      Aucun paiement enregistré
                    </h3>

                    <p>
                      Aucun encaissement n'est
                      actuellement associé à cet
                      étudiant pour cette année.
                    </p>

                  </div>

                )}

              </article>

              {/* ==============================================
                  SYNTHÈSE
              ============================================== */}

              <article className="sf-student-summary">

                <div>

                  <span>
                    SYNTHÈSE FINANCIÈRE
                  </span>

                  <h3>
                    Situation au{" "}
                    {formatDate(
                      new Date()
                    )}
                  </h3>

                </div>

                <div className="sf-summary-values">

                  <div>
                    <span>
                      Total dû
                    </span>

                    <strong>
                      {formatMontant(
                        situationEtudiant.facture,
                        etudiantSelectionne.devise
                      )}
                    </strong>
                  </div>

                  <div>
                    <span>
                      Total versé
                    </span>

                    <strong className="green">
                      {formatMontant(
                        situationEtudiant.paye,
                        etudiantSelectionne.devise
                      )}
                    </strong>
                  </div>

                  <div>
                    <span>
                      Reste à payer
                    </span>

                    <strong className="orange">
                      {formatMontant(
                        situationEtudiant.solde,
                        etudiantSelectionne.devise
                      )}
                    </strong>
                  </div>

                </div>

              </article>

            </>
          )}

          {!etudiantSelectionne &&
            !rechercheEtudiant && (

            <div className="sf-student-empty">

              <div className="sf-empty-illustration">
                ◎
              </div>

              <h2>
                Recherchez un étudiant
              </h2>

              <p>
                Saisissez un matricule,
                un nom ou un prénom pour
                afficher sa situation financière
                et son historique de paiements.
              </p>

            </div>

          )}

          {!etudiantSelectionne &&
            rechercheEtudiant &&
            resultatsEtudiants.length === 0 && (

            <div className="sf-student-empty">

              <div className="sf-empty-illustration">
                ⌕
              </div>

              <h2>
                Aucun étudiant trouvé
              </h2>

              <p>
                Aucun étudiant ne correspond
                à « {rechercheEtudiant} ».
                Vérifiez le matricule ou
                le nom saisi.
              </p>

            </div>

          )}

        </div>
      )}

      {/* ======================================================
          PIED DE PAGE
      ====================================================== */}

      <footer className="sf-page-footer">

        <span>
          Academic Platform · Situation financière
        </span>

        <span>
          Document généré électroniquement
        </span>

      </footer>

    </section>
  );
};

export default SituationsFinancieres;
