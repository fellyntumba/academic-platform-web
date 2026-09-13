import React, { useEffect, useMemo, useState } from "react";
import "./StatsReussitePromotion.css";
import {
  getStatistiquesPromotionsService,
} from "./statistiqueReussiteEchecService";


const StatsReussitePromotion = ({ code_mention }) => {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

 
  // ==========================================================
  // CHARGEMENT DES STATISTIQUES
  // ==========================================================
  useEffect(() => {
    let isMounted = true; 

    const chargerStatistiques = async () => {
      if (!code_mention) {
        if (isMounted) {
          setStats([]);
          setError("Le code de la mention est requis.");
          setLoading(false);
        }

        return;
      }

      try {
        setLoading(true);
        setError("");

        const response = await getStatistiquesPromotionsService({
          code_mention,
        });

        if (!isMounted) {
          return;
        }

        if (!response?.success) {
          throw new Error(
            response?.message ||
              "Impossible de charger les statistiques."
          );
        }

        setStats(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        if (!isMounted) {
          return;
        }

        console.error(
          "Erreur chargement statistiques promotions :",
          err
        );

        setStats([]);
        setError(
          err.message ||
            "Une erreur est survenue lors du chargement des statistiques."
        );
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    chargerStatistiques();

    return () => {
      isMounted = false;
    };
  }, [code_mention]);


  // ==========================================================
  // STATISTIQUES GLOBALES
  // ==========================================================
  const statistiquesGlobales = useMemo(() => {
    if (!stats.length) {
      return {
        moyenneReussite: 0,
        moyenneEchec: 0,
      };
    }

    const totalReussite = stats.reduce(
      (total, promotion) =>
        total + Number(promotion.taux_reussite || 0),
      0
    );

    const totalEchec = stats.reduce(
      (total, promotion) =>
        total + Number(promotion.taux_echec || 0),
      0
    );

    return {
      moyenneReussite: totalReussite / stats.length,
      moyenneEchec: totalEchec / stats.length,
    };
  }, [stats]);


  // ==========================================================
  // FORMATAGE POURCENTAGE
  // ==========================================================
  const formatPourcentage = (value) => {
    const nombre = Number(value || 0);

    return `${nombre.toFixed(2)} %`;
  };


  // ==========================================================
  // CHARGEMENT
  // ==========================================================
  if (loading) {
    return (
      <div className="stats-container fade-in">
        <div className="stats-header">
          <div>
            <h2>Taux de réussite / échec</h2>
            <p>
              Statistiques par promotion
            </p>
          </div>
        </div>

        <div className="stats-loading">
          <div className="loading-spinner"></div>

          <p>
            Chargement des statistiques...
          </p>
        </div>
      </div>
    );
  }


  // ==========================================================
  // ERREUR
  // ==========================================================
  if (error) {
    return (
      <div className="stats-container fade-in">
        <div className="stats-header">
          <div>
            <h2>Taux de réussite / échec</h2>
            <p>
              Statistiques par promotion
            </p>
          </div>
        </div>

        <div className="stats-error">
          <div className="error-icon">
            !
          </div>

          <div>
            <strong>Impossible de charger les statistiques</strong>

            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }


  // ==========================================================
  // AUCUNE DONNÉE
  // ==========================================================
  if (!stats.length) {
    return (
      <div className="stats-container fade-in">
        <div className="stats-header">
          <div>
            <h2>Taux de réussite / échec</h2>
            <p>
              Statistiques par promotion
            </p>
          </div>
        </div>

        <div className="stats-empty">
          <div className="empty-icon">
            📊
          </div>

          <h3>Aucune statistique disponible</h3>

          <p>
            Aucune promotion de l'année en cours ne possède
            actuellement les résultats publiés des deux semestres.
          </p>
        </div>
      </div>
    );
  }


  // ==========================================================
  // AFFICHAGE PRINCIPAL
  // ==========================================================
  return (
    <div className="stats-container fade-in">

      {/* ======================================================
          HEADER
      ====================================================== */}
      <div className="stats-header">

        <div className="stats-title">
          <span className="stats-title-icon">
            📊
          </span>

          <div>
            <h2>
              Taux de réussite / échec
            </h2>

            <p>
              Résultats par promotion
            </p>
          </div>
        </div>

        <div className="promotion-count">
          <span>{stats.length}</span>

          <small>
            {stats.length > 1
              ? "promotions"
              : "promotion"}
          </small>
        </div>

      </div>


      {/* ======================================================
          RÉSUMÉ GLOBAL
      ====================================================== */}
      <div className="global-summary">

        <div className="summary-card success-summary">
          <div className="summary-icon">
            ✓
          </div>

          <div className="summary-content">
            <span>
              Réussite moyenne
            </span>

            <strong>
              {formatPourcentage(
                statistiquesGlobales.moyenneReussite
              )}
            </strong>
          </div>
        </div>


        <div className="summary-card failure-summary">
          <div className="summary-icon">
            ×
          </div>

          <div className="summary-content">
            <span>
              Échec moyen
            </span>

            <strong>
              {formatPourcentage(
                statistiquesGlobales.moyenneEchec
              )}
            </strong>
          </div>
        </div>

      </div>


      {/* ======================================================
          LÉGENDE
      ====================================================== */}
      <div className="stats-legend">

        <div className="legend-item">
          <span className="legend-dot success-dot"></span>
          <span>Réussite</span>
        </div>

        <div className="legend-item">
          <span className="legend-dot failure-dot"></span>
          <span>Échec</span>
        </div>

      </div>


      {/* ======================================================
          TABLEAU
      ====================================================== */}
      <div className="table-wrapper">

        <table className="stats-table">

          <thead>
            <tr>
              <th>
                Promotion
              </th>

              <th>
                Réussite
              </th>

              <th>
                Échec
              </th>

              <th className="visualisation-header">
                Répartition
              </th>
            </tr>
          </thead>


          <tbody>

            {stats.map((promotion, index) => {

              const tauxReussite = Math.max(
                0,
                Math.min(
                  100,
                  Number(promotion.taux_reussite || 0)
                )
              );

              const tauxEchec = Math.max(
                0,
                Math.min(
                  100,
                  Number(promotion.taux_echec || 0)
                )
              );


              return (
                <tr
                  key={`${promotion.nom_promotion}-${index}`}
                >

                  {/* PROMOTION */}
                  <td>
                    <div className="promotion-name">
                      <span className="promotion-number">
                        {index + 1}
                      </span>

                      <strong>
                        {promotion.nom_promotion}
                      </strong>
                    </div>
                  </td>


                  {/* RÉUSSITE */}
                  <td>
                    <div className="percentage-cell success-cell">

                      <span className="percentage-value">
                        {formatPourcentage(tauxReussite)}
                      </span>

                    </div>
                  </td>


                  {/* ÉCHEC */}
                  <td>
                    <div className="percentage-cell failure-cell">

                      <span className="percentage-value">
                        {formatPourcentage(tauxEchec)}
                      </span>

                    </div>
                  </td>


                  {/* VISUALISATION */}
                  <td>

                    <div className="bar-section">

                      <div className="bar-labels">

                        <span className="bar-success-label">
                          {tauxReussite.toFixed(1)}%
                        </span>

                        <span className="bar-failure-label">
                          {tauxEchec.toFixed(1)}%
                        </span>

                      </div>


                      <div
                        className="bar-container"
                        title={`Réussite : ${tauxReussite.toFixed(
                          2
                        )}% — Échec : ${tauxEchec.toFixed(2)}%`}
                      >

                        <div
                          className="success-bar"
                          style={{
                            width: `${tauxReussite}%`,
                          }}
                        ></div>

                        <div
                          className="failure-bar"
                          style={{
                            width: `${tauxEchec}%`,
                          }}
                        ></div>

                      </div>

                    </div>

                  </td>

                </tr>
              );
            })}

          </tbody>

        </table>

      </div>

    </div>
  );
};


export default StatsReussitePromotion;

