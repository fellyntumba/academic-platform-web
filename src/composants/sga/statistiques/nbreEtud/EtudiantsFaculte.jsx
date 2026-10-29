import React, { useEffect, useState } from "react";
import "./EtudiantsFaculte.css";

import {
  getAnneesAcademiques, 
  getStatistiquesEffectifs,
} from "./etudiantsFaculteService";

const EtudiantsFaculte = () => {
  const [annees, setAnnees] = useState([]);
  const [anneeId, setAnneeId] = useState("");

  const [statistiques, setStatistiques] = useState(null);

  const [loadingAnnees, setLoadingAnnees] = useState(true);
  const [loadingStatistiques, setLoadingStatistiques] =
    useState(false);

  const [errorAnnees, setErrorAnnees] = useState("");
  const [errorStatistiques, setErrorStatistiques] =
    useState("");

  /* =====================================================
     Charger les années académiques
  ===================================================== */

  useEffect(() => {
    const chargerAnnees = async () => {
      setLoadingAnnees(true);
      setErrorAnnees("");

      const result = await getAnneesAcademiques();

      if (!result.success) {
        setErrorAnnees(
          result.message ||
            "Impossible de récupérer les années académiques."
        );

        setLoadingAnnees(false);
        return;
      }

      const listeAnnees = result.data || [];

      setAnnees(listeAnnees);

      if (listeAnnees.length > 0) {
        setAnneeId(
          String(listeAnnees[0].id_annee)
        );
      }

      setLoadingAnnees(false);
    };

    chargerAnnees();
  }, []);

  /* =====================================================
     Charger les statistiques lorsque l'année change
  ===================================================== */

  useEffect(() => {
    const chargerStatistiques = async () => {
      if (!anneeId) {
        setStatistiques(null);
        return;
      }

      setLoadingStatistiques(true);
      setErrorStatistiques("");

      const result = await getStatistiquesEffectifs({
        anneeId: Number(anneeId),
      });

      if (!result.success) {
        setStatistiques(null);

        setErrorStatistiques(
          result.message ||
            "Impossible de récupérer les statistiques."
        );

        setLoadingStatistiques(false);
        return;
      }

      setStatistiques(result.data);
      setLoadingStatistiques(false);
    };

    chargerStatistiques();
  }, [anneeId]);

  /* =====================================================
     Changement d'année
  ===================================================== */

  const handleAnneeChange = (event) => {
    setAnneeId(event.target.value);
  };

  /* =====================================================
     Chargement des années
  ===================================================== */

  if (loadingAnnees) {
    return (
      <div className="students-stats-wrapper">
        <div className="stats-loading">
          <div className="stats-spinner"></div>

          <span>
            Chargement des années académiques...
          </span>
        </div>
      </div>
    );
  }

  /* =====================================================
     Erreur années
  ===================================================== */

  if (errorAnnees) {
    return (
      <div className="students-stats-wrapper">
        <div className="stats-error">
          <div className="stats-error-icon">
            !
          </div>

          <div>
            <h3>
              Impossible de charger les années
            </h3>

            <p>{errorAnnees}</p>
          </div>
        </div>
      </div>
    );
  }

  /* =====================================================
     Aucune année
  ===================================================== */

  if (annees.length === 0) {
    return (
      <div className="students-stats-wrapper">
        <div className="empty-stats">
          <div className="empty-stats-icon">
            0
          </div>

          <h3>
            Aucune année académique
          </h3>

          <p>
            Aucune année académique n'est disponible
            pour consulter les effectifs.
          </p>
        </div>
      </div>
    );
  }

  const facultes =
    statistiques?.facultes || [];

  const totalUniversite =
    statistiques?.total_universite || 0;

  const anneeAcademique =
    statistiques?.annee_academique;

  return (
    <div className="students-stats-wrapper">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="stats-header">
        <div>
          <span className="stats-eyebrow">
            EFFECTIFS ACADÉMIQUES
          </span>

          <h2>
            Effectifs des étudiants
          </h2>

          <p>
            Consultez les effectifs régulièrement
            inscrits par faculté et par promotion.
          </p>
        </div>
      </div>

      {/* =================================================
          SÉLECTION ANNÉE ACADÉMIQUE
      ================================================= */}

      <div className="academic-year-selector">
        <div className="academic-year-selector-content">

          <div className="academic-year-icon">
            <span>▣</span>
          </div>

          <div className="academic-year-info">
            <label htmlFor="annee-academique">
              Année académique
            </label>

            <span>
              Sélectionnez l'année à consulter
            </span>
          </div>

          <div className="academic-year-select-wrapper">
            <select
              id="annee-academique"
              value={anneeId}
              onChange={handleAnneeChange}
              disabled={loadingStatistiques}
            >
              {annees.map((annee) => (
                <option
                  key={annee.id_annee}
                  value={annee.id_annee}
                >
                  {annee.libelle}
                </option>
              ))}
            </select>
          </div>

        </div>
      </div>

      {/* =================================================
          STATISTIQUES
      ================================================= */}

      {loadingStatistiques ? (
        <div className="stats-loading">
          <div className="stats-spinner"></div>

          <span>
            Chargement des effectifs...
          </span>
        </div>
      ) : errorStatistiques ? (
        <div className="stats-error">
          <div className="stats-error-icon">
            !
          </div>

          <div>
            <h3>
              Impossible de charger les effectifs
            </h3>

            <p>
              {errorStatistiques}
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* =================================================
              ANNÉE SÉLECTIONNÉE
          ================================================= */}

          {anneeAcademique && (
            <div className="selected-year-info">
              <span>
                Effectifs pour
              </span>

              <strong>
                {anneeAcademique.libelle}
              </strong>
            </div>
          )}

          {/* =================================================
              TOTAL UNIVERSITÉ
          ================================================= */}

          <div className="university-total-card">
            <div className="university-total-content">

              <div>
                <span className="university-total-label">
                  TOTAL DES ÉTUDIANTS
                </span>

                <div className="university-total-number">
                  {totalUniversite.toLocaleString(
                    "fr-FR"
                  )}
                </div>

                <span className="university-total-description">
                  Étudiants régulièrement inscrits
                </span>
              </div>

              <div className="university-total-icon">
                <span>👥</span>
              </div>

            </div>
          </div>

          {/* =================================================
              TITRE FACULTÉS
          ================================================= */}

          <div className="section-heading">
            <div>
              <h3>
                Répartition par faculté
              </h3>

              <p>
                Effectifs régulièrement inscrits par
                promotion
              </p>
            </div>

            <span className="faculty-count">
              {facultes.length}{" "}
              {facultes.length > 1
                ? "facultés"
                : "faculté"}
            </span>
          </div>

          {/* =================================================
              FACULTÉS
          ================================================= */}

          {facultes.length === 0 ? (
            <div className="empty-stats">

              <div className="empty-stats-icon">
                0
              </div>

              <h3>
                Aucun effectif disponible
              </h3>

              <p>
                Aucun étudiant régulièrement inscrit
                n'est enregistré pour cette année
                académique.
              </p>

            </div>
          ) : (
            <div className="faculty-list">

              {facultes.map((faculte) => (

                <div
                  key={faculte.id_faculte}
                  className="faculty-card"
                >

                  {/* =================================================
                      EN-TÊTE FACULTÉ
                  ================================================= */}

                  <div className="faculty-card-header">

                    <div className="faculty-title-wrapper">

                      <div className="faculty-icon">
                        {faculte.nom_faculte
                          ?.charAt(0)
                          ?.toUpperCase() || "F"}
                      </div>

                      <div>
                        <h3>
                          {faculte.nom_faculte}
                        </h3>

                        <span>
                          {faculte.promotions?.length ||
                            0}{" "}
                          {faculte.promotions?.length > 1
                            ? "promotions"
                            : "promotion"}
                        </span>
                      </div>

                    </div>

                    <div className="faculty-total">

                      <strong>
                        {(
                          faculte.total_etudiants || 0
                        ).toLocaleString("fr-FR")}
                      </strong>

                      <span>
                        étudiants
                      </span>

                    </div>

                  </div>

                  {/* =================================================
                      PROMOTIONS
                  ================================================= */}

                  <div className="promotion-list">

                    {(faculte.promotions || []).map(
                      (promotion) => (

                        <div
                          key={
                            promotion.promotion_version_id
                          }
                          className="promotion-row"
                        >

                          <div className="promotion-name">

                            <span className="promotion-dot"></span>

                            <span>
                              {promotion.nom_promotion}
                            </span>

                          </div>

                          <div className="promotion-count">

                            <strong>
                              {(
                                promotion.nombre_etudiants ||
                                0
                              ).toLocaleString("fr-FR")}
                            </strong>

                            <span>
                              {promotion.nombre_etudiants ===
                              1
                                ? "étudiant"
                                : "étudiants"}
                            </span>

                          </div>

                        </div>

                      )
                    )}

                  </div>

                </div>

              ))}

            </div>
          )}

        </>
      )}

    </div>
  );
};

export default EtudiantsFaculte;

