
import React, { useState, useEffect } from "react";

import {
  getAnneesAcademiques,
  getRessourcesByMention,
} from "./listeRessourcesService";

import "./ListeRessourcesAcces.css";

const ListeRessourcesAcces = ({ code_mention }) => {

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
  // 2. CHARGER LES RESSOURCES SELON LA MENTION ET L'ANNÉE
  // =========================================================

  useEffect(() => {
    let cancelled = false;

    const chargerRessources = async () => {

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

        const result = await getRessourcesByMention({
          code_mention,
          libelle_annee: libelleAnnee,
        });

        if (cancelled) return;

        if (result?.success) {

          const ressources = Array.isArray(result.data)
            ? result.data
            : [];

          setListe(ressources);

          setAnneeAcademique(
            result.annee_academique?.libelle ||
              result.annee_academique ||
              libelleAnnee
          );

          if (ressources.length === 0) {

            showMessage(
              "Aucune promotion trouvée pour cette mention et cette année académique.",
              "error"
            );

          }

        } else {

          setListe([]);

          showMessage(
            result?.message ||
              "Impossible de récupérer les ressources d'accès.",
            "error"
          );

        }

      } catch (error) {

        if (!cancelled) {

          setListe([]);

          showMessage(
            error.message ||
              "Erreur lors de la récupération des ressources d'accès.",
            "error"
          );

        }

      } finally {

        if (!cancelled) {
          setLoading(false);
        }

      }

    };

    chargerRessources();

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

  const getRessourcesPromotion = (promotion) => {

    return Array.isArray(promotion.ressources)
      ? promotion.ressources
      : [];

  };

  // =========================================================
  // 5. EXTRACTION DES INFORMATIONS D'UNE RESSOURCE
  // =========================================================

  const getCodeRessource = (ressource) => {

    return (
      ressource.code ||
      "Ressource non renseignée"
    );

  };

  const getTranches = (ressource) => {

    return Array.isArray(ressource.tranches)
      ? ressource.tranches
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
      return `${montant} USD`;
    }

    return `${new Intl.NumberFormat("fr-FR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(valeur)} USD`;

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
  // 8. CALCUL DU NOMBRE TOTAL DE TRANCHES
  // =========================================================

  const getNombreTranches = (ressources) => {

    return ressources.reduce(
      (total, ressource) =>
        total + getTranches(ressource).length,
      0
    );

  };

  // =========================================================
  // 9. AFFICHAGE
  // =========================================================

  return (

    <div className="lra-container lra-fade-in">

      <h2 className="lra-title">
        Liste des ressources d'accès par promotion
      </h2>

      {/* SÉLECTEUR D'ANNÉE ACADÉMIQUE */}

      <div className="lra-annee-filter">

        <div className="lra-annee-filter-icon">
          <span>▣</span>
        </div>

        <div className="lra-annee-filter-content">

          <label htmlFor="lra-annee-select">
            Année académique
          </label>

          <select
            id="lra-annee-select"
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
        <div className="lra-annee-selected">

          <span>Année sélectionnée</span>

          <strong>
            {getAnneeLabel()}
          </strong>

        </div>
      )}

      {/* ERREUR DE CHARGEMENT DES ANNÉES */}

      {errorAnnees && (
        <div className="lra-notification lra-notification-error">
          {errorAnnees}
        </div>
      )}

      {/* NOTIFICATIONS */}

      {message && (
        <div
          className={`lra-notification lra-notification-${messageType}`}
        >
          {message}
        </div>
      )}

      {/* CHARGEMENT DES RESSOURCES */}

      {loading && (
        <div className="lra-loading">

          <span className="lra-spinner"></span>

          <span>
            Chargement des ressources d'accès de {anneeAcademique}...
          </span>

        </div>
      )}

      {/* RÉSULTATS */}

      {!loading &&
        !loadingAnnees &&
        !errorAnnees && (

        <div className="lra-results">

          {liste.length > 0 ? (

            liste.map((promotion, index) => {

              const ressources = getRessourcesPromotion(promotion);
              const nombreTranches = getNombreTranches(ressources);

              return (

                <div
                  className="lra-promotion-card"
                  key={
                    promotion.promotion_version_id ||
                    promotion.promotion_id ||
                    index
                  }
                >

                  {/* EN-TÊTE PROMOTION */}

                  <div className="lra-promotion-header">

                    <div className="lra-promotion-header-info">

                      <h3>
                        {getNomPromotion(promotion)}
                      </h3>

                    

                    </div>

                    <div className="lra-promotion-ressources-count">

                      <span>
                        {ressources.length}{" "}
                        {ressources.length > 1
                          ? "ressources"
                          : "ressource"}
                      </span>

                      <span>
                        {nombreTranches}{" "}
                        {nombreTranches > 1
                          ? "tranches"
                          : "tranche"}
                      </span>

                    </div>

                  </div>

                  {/* PARCOURS */}

                  {promotion.code_parcours && (

                    <div className="lra-promotion-parcours">
                      Parcours : {promotion.code_parcours}
                    </div>

                  )}

                  {/* RESSOURCES DE LA PROMOTION */}

                  {ressources.length === 0 ? (

                    <div className="lra-empty-promotion-ressources">
                      Aucune ressource associée à cette promotion.
                    </div>

                  ) : (

                    <div className="lra-ressources-list">

                      {ressources.map((item, ressourceIndex) => {

                        const tranches = getTranches(item);

                        return (

                          <div
                            className="lra-ressource-item"
                            key={
                              item.id_ressource ||
                              item.id_regle ||
                              ressourceIndex
                            }
                          >

                            <div className="lra-ressource-item-number">
                              {ressourceIndex + 1}
                            </div>

                            <div className="lra-ressource-item-info">

                              <div className="lra-ressource-item-header">

                                <h4>
                                  {getCodeRessource(item)}
                                </h4>

                                <span className="lra-ressource-tranches-count">
                                  {tranches.length}{" "}
                                  {tranches.length > 1
                                    ? "tranches"
                                    : "tranche"}
                                </span>

                              </div>

                              <p>
                                Date de création :{" "}
                                {formatDate(item.date_creation)}
                              </p>

                              {/* TRANCHES ASSOCIÉES À LA RESSOURCE */}

                              {tranches.length > 0 ? (

                                <div className="lra-ressource-tranches">

                                  <h5>
                                    Tranches de paiement associées
                                  </h5>

                                  <div className="lra-ressource-tranches-list">

                                    {tranches.map(
                                      (tranche, trancheIndex) => (

                                        <div
                                          className="lra-ressource-tranche-item"
                                          key={
                                            tranche.id_tranche ||
                                            trancheIndex
                                          }
                                        >

                                          <div className="lra-ressource-tranche-info">

                                            <strong>
                                              {tranche.libelle ||
                                                `Tranche ${tranche.numero_tranche}`}
                                            </strong>

                                            <span>
                                              {tranche.type_tarif && (
                                                <>
                                                  Type de frais :{" "}
                                                  {tranche.type_tarif}
                                                  {" · "}
                                                </>
                                              )}

                                              Échéance :{" "}
                                              {formatDate(
                                                tranche.date_echeance
                                              )}
                                            </span>

                                          </div>

                                          <div className="lra-ressource-tranche-montant">

                                            {formatMontant(
                                              tranche.montant
                                            )}

                                          </div>

                                        </div>

                                      )
                                    )}

                                  </div>

                                </div>

                              ) : (

                                <div className="lra-empty-ressource-tranches">
                                  Aucune tranche de paiement associée à cette ressource.
                                </div>

                              )}

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

            <div className="lra-empty-list">

              {!code_mention
                ? "Aucune mention sélectionnée."
                : !anneeId
                ? "Sélectionnez une année académique pour afficher les ressources."
                : "Aucune ressource disponible pour cette année académique."}

            </div>

          )}

        </div>

      )}

    </div>

  );

};

export default ListeRessourcesAcces;

