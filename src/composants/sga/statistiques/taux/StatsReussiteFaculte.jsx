import React, { useEffect, useState } from "react";
import {
  getAnneesAcademiques,
  getStatistiquesReussite,
} from "./statsReussite";
import "./StatsReussiteFaculte.css";

const StatsReussiteFaculte = () => {
  const [annees, setAnnees] = useState([]);
  const [anneeId, setAnneeId] = useState(""); 
  const [data, setData] = useState(null);

  const [loadingAnnees, setLoadingAnnees] = useState(true);
  const [loadingStats, setLoadingStats] = useState(false);
  const [error, setError] = useState("");
 
  useEffect(() => {
    const chargerAnnees = async () => {
      setLoadingAnnees(true);
      setError("");

      const result = await getAnneesAcademiques();

      if (result.success) {
        setAnnees(result.data || []);
      } else {
        setError(result.message);
      }

      setLoadingAnnees(false);
    };

    chargerAnnees();
  }, []);

  useEffect(() => {
    if (!anneeId) {
      setData(null);
      return;
    }

    const chargerStatistiques = async () => {
      setLoadingStats(true);
      setError("");

      const result = await getStatistiquesReussite({
        anneeId: Number(anneeId),
      });

      if (result.success) {
        setData(result.data);
      } else {
        setData(null);
        setError(result.message);
      }

      setLoadingStats(false);
    };

    chargerStatistiques();
  }, [anneeId]);

  const formatTaux = (value) => {
    const taux = Number(value);

    if (Number.isNaN(taux)) {
      return "0.00%";
    }

    return `${taux.toFixed(2)}%`;
  };

  const formatNombre = (value) => {
    return Number(value || 0).toLocaleString("fr-FR");
  };

  const getAnneeLabel = () => {
    const annee = annees.find(
      (item) => String(item.id_annee) === String(anneeId)
    );

    if (!annee) {
      return "";
    }

    return (
      annee.libelle ||
      annee.nom_annee ||
      annee.annee ||
      `${annee.annee_debut}-${annee.annee_fin}`
    );
  };

  return (
    <div className="stats-reussite-page">
      
      <div className="stats-reussite-filter-card">
        <div className="stats-reussite-filter-icon">
          <span>▣</span>
        </div>

        <div className="stats-reussite-filter-content">
          <label htmlFor="annee-academique">
            Année académique
          </label>

          <select
            id="annee-academique"
            value={anneeId}
            onChange={(e) => setAnneeId(e.target.value)}
            disabled={loadingAnnees}
          >
            <option value="">
              {loadingAnnees
                ? "Chargement..."
                : "Sélectionner une année"}
            </option>

            {annees.map((annee) => (
              <option
                key={annee.id_annee}
                value={annee.id_annee}
              >
                {annee.libelle ||
                  annee.nom_annee ||
                  annee.annee ||
                  `${annee.annee_debut}-${annee.annee_fin}`}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* =========================
          ANNÉE SÉLECTIONNÉE
      ========================= */}
      {anneeId && (
        <div className="stats-reussite-selected-year">
          <span>Année sélectionnée</span>
          <strong>{getAnneeLabel()}</strong>
        </div>
      )}

      {/* =========================
          ERREUR
      ========================= */}
      {error && (
        <div className="stats-reussite-error">
          {error}
        </div>
      )}

      {/* =========================
          CHARGEMENT
      ========================= */}
      {loadingStats && (
        <div className="stats-reussite-loading">
          <div className="stats-reussite-spinner"></div>
          <span>Chargement des statistiques...</span>
        </div>
      )}

      {/* =========================
          CONTENU
      ========================= */}
      {!loadingStats && data && (
        <>
          {/* =========================
              TOTAL UNIVERSITÉ
          ========================= */}
          <div className="university-success-card">
            <div className="university-success-left">
              <div className="university-success-icon">
                ✓
              </div>

              <div>
                <span className="university-success-label">
                  RÉUSSITE UNIVERSITAIRE
                </span>

                <h2>
                  {formatTaux(
                    data.taux_reussite_universite
                  )}
                </h2>

                <p>
                  Taux de réussite global pour l'année
                  sélectionnée.
                </p>
              </div>
            </div>

            <div className="university-success-right">
              <div className="university-success-stat">
                <strong>
                  {formatNombre(data.total_universite)}
                </strong>
                <span>étudiants</span>
              </div>

              <div className="university-success-divider"></div>

              <div className="university-success-stat success">
                <strong>
                  {formatNombre(
                    data.nombre_reussites_universite
                  )}
                </strong>
                <span>réussites</span>
              </div>

              <div className="university-success-divider"></div>

              <div className="university-success-stat failure">
                <strong>
                  {formatNombre(
                    data.nombre_echecs_universite
                  )}
                </strong>
                <span>échecs</span>
              </div>
            </div>
          </div>

          {/* =========================
              TITRE FACULTÉS
          ========================= */}
          <div className="stats-reussite-section-header">
            <div>
              <span>ANALYSE DÉTAILLÉE</span>
              <h2>Répartition par faculté</h2>
            </div>

            <div className="stats-reussite-section-count">
              {data.facultes?.length || 0} facultés
            </div>
          </div>

          {/* =========================
              FACULTÉS
          ========================= */}
          <div className="faculty-success-list">
            {data.facultes?.map((faculte) => {
              const tauxReussite =
                Number(faculte.taux_reussite) || 0;

              return (
                <div
                  key={faculte.id_faculte}
                  className="faculty-success-card"
                >
                  {/* HEADER FACULTÉ */}
                  <div className="faculty-success-card-header">
                    <div className="faculty-success-title-wrapper">
                      <div className="faculty-success-icon">
                        {faculte.nom_faculte
                          ?.charAt(0)
                          ?.toUpperCase() || "F"}
                      </div>

                      <div>
                        <h3>{faculte.nom_faculte}</h3>

                        <span>
                          {faculte.promotions?.length || 0}{" "}
                          {faculte.promotions?.length > 1
                            ? "promotions"
                            : "promotion"}
                        </span>
                      </div>
                    </div>

                    <div className="faculty-success-total">
                      <strong>
                        {formatNombre(
                          faculte.total_etudiants
                        )}
                      </strong>

                      <span>étudiants</span>
                    </div>
                  </div>

                  {/* RÉSUMÉ */}
                  <div className="faculty-success-summary">
                    <div className="faculty-success-stat success">
                      <div className="faculty-success-stat-icon">
                        ✓
                      </div>

                      <div>
                        <span>Réussite</span>

                        <strong>
                          {formatTaux(
                            faculte.taux_reussite
                          )}
                        </strong>

                        <small>
                          {formatNombre(
                            faculte.nombre_reussites
                          )}{" "}
                          étudiants
                        </small>
                      </div>
                    </div>

                    <div className="faculty-success-stat failure">
                      <div className="faculty-success-stat-icon">
                        ×
                      </div>

                      <div>
                        <span>Échec</span>

                        <strong>
                          {formatTaux(
                            faculte.taux_echec
                          )}
                        </strong>

                        <small>
                          {formatNombre(
                            faculte.nombre_echecs
                          )}{" "}
                          étudiants
                        </small>
                      </div>
                    </div>
                  </div>

                  {/* BARRE DE RÉUSSITE */}
                  <div className="faculty-success-progress-wrapper">
                    <div className="faculty-success-progress-label">
                      <span>Réussite globale</span>

                      <strong>
                        {formatTaux(
                          faculte.taux_reussite
                        )}
                      </strong>
                    </div>

                    <div className="faculty-success-progress">
                      <div
                        className="faculty-success-progress-value"
                        style={{
                          width: `${Math.min(
                            Math.max(tauxReussite, 0),
                            100
                          )}%`,
                        }}
                      ></div>
                    </div>
                  </div>

                  {/* PROMOTIONS */}
                  <div className="faculty-success-promotion-list">
                    {(faculte.promotions || []).map(
                      (promotion) => (
                        <div
                          key={
                            promotion.promotion_version_id
                          }
                          className="faculty-success-promotion-row"
                        >
                          <div className="faculty-success-promotion-name">
                            <span className="faculty-success-promotion-dot"></span>

                            <span>
                              {promotion.nom_promotion}
                            </span>
                          </div>

                          <div className="faculty-success-promotion-stats">
                            <div className="faculty-success-promotion-stat success">
                              <strong>
                                {formatTaux(
                                  promotion.taux_reussite
                                )}
                              </strong>

                              <span>réussite</span>
                            </div>

                            <div className="faculty-success-promotion-stat failure">
                              <strong>
                                {formatTaux(
                                  promotion.taux_echec
                                )}
                              </strong>

                              <span>échec</span>
                            </div>

                            <div className="faculty-success-promotion-total">
                              <strong>
                                {formatNombre(
                                  promotion.total_etudiants
                                )}
                              </strong>

                              <span>étudiants</span>
                            </div>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* =========================
          AUCUNE DONNÉE
      ========================= */}
      {!loadingStats &&
        anneeId &&
        !error &&
        !data && (
          <div className="stats-reussite-empty">
            Aucune statistique disponible pour cette
            année académique.
          </div>
        )}
    </div>
  );
};

export default StatsReussiteFaculte;

