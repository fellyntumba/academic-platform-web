

import React, { useState, useEffect } from "react";

import {
  getAnneesAcademiques,
  getFraisAcademiquesByMention,
} from "./listeFraisService";

import "./ListeFraisAcademiques.css";

const ListesFraisAcademiques = ({ code_mention }) => {
  const [liste, setListe] = useState([]);
  const [annees, setAnnees] = useState([]);

  const [anneeId, setAnneeId] = useState("");
  const [anneeAcademique, setAnneeAcademique] = useState("");

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const [loadingAnnees, setLoadingAnnees] = useState(true);
  const [loading, setLoading] = useState(false);

  const [errorAnnees, setErrorAnnees] = useState("");

  // =========================================================
  // NOTIFICATIONS
  // =========================================================

  const showMessage = (msg, type = "success") => {
    setMessage(msg);
    setMessageType(type);

    setTimeout(() => {
      setMessage("");
      setMessageType("");
    }, 4000);
  };

  // =========================================================
  // LIBELLÉ D'UNE ANNÉE ACADÉMIQUE
  // =========================================================

  const getLibelleAnnee = (annee) => {
    if (!annee) return "";

    return (
      annee.libelle ||
      annee.nom_annee ||
      annee.annee ||
      (
        annee.annee_debut != null &&
        annee.annee_fin != null
          ? `${annee.annee_debut}-${annee.annee_fin}`
          : ""
      )
    );
  };

  // =========================================================
  // 1. CHARGER LES ANNÉES ACADÉMIQUES
  // =========================================================

  useEffect(() => {
    let cancelled = false;

    const chargerAnnees = async () => {
      setLoadingAnnees(true);
      setErrorAnnees("");

      try {
        const result = await getAnneesAcademiques();

        if (cancelled) return;

        if (!result?.success) {
          setAnnees([]);
          setAnneeId("");

          setErrorAnnees(
            result?.message ||
              "Impossible de récupérer les années académiques."
          );

          return;
        }

        const anneesDisponibles = Array.isArray(result.data)
          ? result.data
          : [];

        setAnnees(anneesDisponibles);

        // Sélectionner l'année en cours si elle existe.
        // Sinon, sélectionner la première année disponible.

        const anneeEnCours = anneesDisponibles.find(
          (annee) =>
            String(annee.statut || "")
              .trim()
              .toLowerCase() === "en cours"
        );

        const anneeParDefaut =
          anneeEnCours || anneesDisponibles[0];

        setAnneeId(
          anneeParDefaut
            ? String(anneeParDefaut.id_annee)
            : ""
        );

      } catch (error) {
        if (!cancelled) {
          setAnnees([]);
          setAnneeId("");

          setErrorAnnees(
            error.message ||
              "Erreur lors du chargement des années académiques."
          );
        }

      } finally {
        if (!cancelled) {
          setLoadingAnnees(false);
        }
      }
    };

    chargerAnnees();

    return () => {
      cancelled = true;
    };
  }, []);

  // =========================================================
  // 2. CHARGER LES FRAIS SELON LA MENTION ET L'ANNÉE
  // =========================================================

  useEffect(() => {
    let cancelled = false;

    const chargerFraisAcademiques = async () => {
      // Ne rien charger tant que les années ne sont
      // pas encore disponibles.

      if (loadingAnnees) return;

      if (!code_mention || !anneeId) {
        setListe([]);
        setAnneeAcademique("");
        setLoading(false);

        return;
      }

      // Retrouver l'année académique sélectionnée.

      const anneeSelectionnee = annees.find(
        (annee) =>
          String(annee.id_annee) === String(anneeId)
      );

      const libelleAnnee = getLibelleAnnee(
        anneeSelectionnee
      );

      if (!libelleAnnee) {
        setListe([]);
        setAnneeAcademique("");
        setLoading(false);

        showMessage(
          "Le libellé de l'année académique est introuvable.",
          "error"
        );

        return;
      }

      setLoading(true);
      setListe([]);
      setMessage("");
      setMessageType("");
      setAnneeAcademique(libelleAnnee);

      try {
        const result = await getFraisAcademiquesByMention({
          code_mention,
          libelle_annee: libelleAnnee,
        });

        if (cancelled) return;

        if (result?.success) {
          const fraisAcademiques = Array.isArray(result.data)
            ? result.data
            : [];

          setListe(fraisAcademiques);

          setAnneeAcademique(
            result.annee_academique?.libelle ||
              result.annee_academique ||
              libelleAnnee
          );

          if (fraisAcademiques.length === 0) {
            showMessage(
              "Aucun frais académique trouvé pour cette mention et cette année académique.",
              "error"
            );
          }

        } else {
          setListe([]);

          showMessage(
            result?.message ||
              "Impossible de récupérer les frais académiques.",
            "error"
          );
        }

      } catch (error) {
        if (!cancelled) {
          setListe([]);

          showMessage(
            error.message ||
              "Erreur lors de la récupération des frais académiques.",
            "error"
          );
        }

      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    chargerFraisAcademiques();

    return () => {
      cancelled = true;
    };

  }, [
    code_mention,
    anneeId,
    annees,
    loadingAnnees
  ]);

  // =========================================================
  // 3. LIBELLÉ DE L'ANNÉE SÉLECTIONNÉE
  // =========================================================

  const getAnneeLabel = () => {
    const annee = annees.find(
      (item) =>
        String(item.id_annee) === String(anneeId)
    );

    return getLibelleAnnee(annee);
  };

  // =========================================================
  // 4. EXTRACTION DES INFORMATIONS D'UNE PROMOTION
  // =========================================================

  const getNomPromotion = (promotion) => {
    return (
      promotion.nom_promotion ||
      "Promotion non renseignée"
    );
  };

  const getFraisPromotion = (promotion) => {
    return Array.isArray(promotion.frais)
      ? promotion.frais
      : [];
  };

  // =========================================================
  // 5. EXTRACTION DES INFORMATIONS D'UN TARIF
  // =========================================================

  const getNomFrais = (frais) => {
    return (
      frais.type_tarif ||
      "Type de frais non renseigné"
    );
  };

  const getTranches = (frais) => {
    return Array.isArray(frais.tranches)
      ? frais.tranches
      : [];
  };

  // =========================================================
  // 6. FORMATAGE DES MONTANTS
  // =========================================================

  const formatMontant = (montant) => {
    if (
      montant === null ||
      montant === undefined ||
      montant === ""
    ) {
      return "—";
    }

    const valeur = Number(montant);

    if (Number.isNaN(valeur)) {
      return `${montant} CDF`;
    }

    return `${new Intl.NumberFormat("fr-FR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(valeur)} CDF`;
  };

  // =========================================================
  // 7. FORMATAGE DES DATES
  // =========================================================

  const formatDate = (date) => {
    if (!date) return "Non définie";

    const dateFormatee = new Date(date);

    if (Number.isNaN(dateFormatee.getTime())) {
      return "Non définie";
    }

    return dateFormatee.toLocaleDateString("fr-FR");
  };

  // =========================================================
  // 8. AFFICHAGE
  // =========================================================

  return (
    <div className="lfa-container lfa-fade-in">

      <h2 className="lfa-title">
        Liste des frais académiques par promotion
      </h2>

      {/* SÉLECTEUR D'ANNÉE ACADÉMIQUE */}

      <div className="lfa-annee-filter">

        <div className="lfa-annee-filter-icon">
          <span>▣</span>
        </div>

        <div className="lfa-annee-filter-content">

          <label htmlFor="lfa-annee-select">
            Année académique
          </label>

          <select
            id="lfa-annee-select"
            value={anneeId}
            onChange={(e) => setAnneeId(e.target.value)}
            disabled={
              loadingAnnees ||
              annees.length === 0
            }
          >
            <option value="">
              {loadingAnnees
                ? "Chargement des années..."
                : "Sélectionner une année"}
            </option>

            {annees.map((annee) => (
              <option
                key={annee.id_annee}
                value={annee.id_annee}
              >
                {getLibelleAnnee(annee) ||
                  `Année ${annee.id_annee}`}
              </option>
            ))}
          </select>

        </div>
      </div>

      {/* ANNÉE SÉLECTIONNÉE */}

      {anneeId && (
        <div className="lfa-annee-selected">
          <span>Année sélectionnée</span>

          <strong>
            {getAnneeLabel()}
          </strong>
        </div>
      )}

      {/* ERREUR DE CHARGEMENT DES ANNÉES */}

      {errorAnnees && (
        <div className="lfa-notification lfa-notification-error">
          {errorAnnees}
        </div>
      )}

      {/* NOTIFICATIONS */}

      {message && (
        <div
          className={`lfa-notification lfa-notification-${messageType}`}
        >
          {message}
        </div>
      )}

      {/* CHARGEMENT DES FRAIS */}

      {loading && (
        <div className="lfa-loading">

          <span className="lfa-spinner"></span>

          <span>
            Chargement des frais académiques de {anneeAcademique}...
          </span>

        </div>
      )}

      {/* RÉSULTATS */}

      {!loading &&
        !loadingAnnees &&
        !errorAnnees && (

        <div className="lfa-results">

          {liste.length > 0 ? (

            liste.map((promotion, index) => {
              const frais = getFraisPromotion(promotion);

              return (
                <div
                  className="lfa-promotion-card"
                  key={
                    promotion.promotion_version_id ||
                    promotion.promotion_id ||
                    index
                  }
                >

                  {/* EN-TÊTE PROMOTION */}

                  <div className="lfa-promotion-header">

                    <div className="lfa-promotion-header-info">

                      <h3>
                        {getNomPromotion(promotion)}
                      </h3>


                    </div>

                    <span className="lfa-promotion-frais-count">
                      {frais.length}{" "}
                      {frais.length > 1
                        ? "types de frais"
                        : "type de frais"}
                    </span>

                  </div>

                  {/* PARCOURS */}

                  {promotion.code_parcours && (
                    <div className="lfa-promotion-parcours">
                      Parcours : {promotion.code_parcours}
                    </div>
                  )}

                  {/* FRAIS DE LA PROMOTION */}

                  {frais.length === 0 ? (

                    <div className="lfa-empty-promotion-frais">
                      Aucun frais associé à cette promotion.
                    </div>

                  ) : (

                    <div className="lfa-frais-list">

                      {frais.map((item, fraisIndex) => {
                        const tranches = getTranches(item);

                        return (
                          <div
                            className="lfa-frais-item"
                            key={
                              item.id_tarif ||
                              fraisIndex
                            }
                          >

                            <div className="lfa-frais-item-number">
                              {fraisIndex + 1}
                            </div>

                            <div className="lfa-frais-item-info">

                              <h4>
                                {getNomFrais(item)}
                              </h4>

                              <p>
                                Date de fixation :{" "}
                                {formatDate(item.date_creation)}
                              </p>

                              {/* TRANCHES DU TARIF */}

                              {tranches.length > 0 && (
                                <div className="lfa-frais-tranches">

                                  <h5>
                                    Échéancier de paiement
                                  </h5>

                                  <div className="lfa-frais-tranches-list">

                                    {tranches.map(
                                      (tranche, trancheIndex) => (
                                        <div
                                          className="lfa-frais-tranche-item"
                                          key={
                                            tranche.id_tranche ||
                                            trancheIndex
                                          }
                                        >

                                          <div className="lfa-frais-tranche-info">

                                            <strong>
                                              {tranche.libelle ||
                                                `Tranche ${tranche.numero_tranche}`}
                                            </strong>

                                            <span>
                                              Échéance :{" "}
                                              {formatDate(
                                                tranche.date_echeance
                                              )}
                                            </span>

                                          </div>

                                          <div className="lfa-frais-tranche-montant">
                                            {formatMontant(
                                              tranche.montant
                                            )}
                                          </div>

                                        </div>
                                      )
                                    )}

                                  </div>
                                </div>
                              )}

                            </div>

                            {/* MONTANT TOTAL DU TARIF */}

                            <div className="lfa-frais-item-montant">
                              {formatMontant(item.montant)}
                            </div>

                          </div>
                        );
                      })}

                    </div>
                  )}

                </div>
              );
            })

          ) : (

            <div className="lfa-empty-list">
              {!code_mention
                ? "Aucune mention sélectionnée."
                : !anneeId
                ? "Sélectionnez une année académique pour afficher les frais."
                : "Aucun frais académique disponible pour cette année académique."}
            </div>

          )}

        </div>
      )}

    </div>
  );
};

export default ListesFraisAcademiques;
