import React, { useState, useEffect } from "react";
import "./ListeEnseignants.css";

import { getEnseignantsStatsService } from "./listeEnseService";

const ListeEnseignants = () => {
  const [enseignants, setEnseignants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEnseignants = async () => {
      try {
        setLoading(true);

        const data = await getEnseignantsStatsService();
        setEnseignants(data || []);

      } catch (error) {
        console.error("Erreur chargement enseignants :", error);
        setEnseignants([]);
      } finally {
        setLoading(false);
      }
    };

    loadEnseignants();
  }, []);

  return (
    <div className="liste-enseignants-container fade-in">

      {/* =========================
          HEADER
      ========================= */}
      <div className="liste-header">

        <div className="liste-header-left">

          <div className="liste-header-icon">
            <span>◉</span>
          </div>

          <div>
            <span className="liste-eyebrow">
              PERSONNEL ACADÉMIQUE
            </span>

            <h2>Liste des enseignants</h2>

            <p>
              Consultez les enseignants enregistrés dans
              l'établissement.
            </p>
          </div>

        </div>

        <button className="download-btn">
          <span className="download-icon">↓</span>
          <span>Télécharger</span>
        </button>

      </div>

      {/* =========================
          STATISTIQUE
      ========================= */}
      <div className="enseignants-summary">

        <div className="enseignants-summary-icon">
          <span>👤</span>
        </div>

        <div className="enseignants-summary-content">
          <span>ENSEIGNANTS ENREGISTRÉS</span>

          <strong>
            {enseignants.length.toLocaleString("fr-FR")}
          </strong>
        </div>

        <div className="enseignants-summary-status">
          {loading ? "CHARGEMENT" : "À JOUR"}
        </div>

      </div>

      {/* =========================
          TABLEAU
      ========================= */}
      <div className="liste-scrollable">

        {loading ? (
          <div className="enseignants-loading">

            <div className="enseignants-spinner"></div>

            <div>
              <strong>Chargement des enseignants</strong>
              <span>
                Récupération des informations...
              </span>
            </div>

          </div>
        ) : enseignants.length === 0 ? (
          <div className="enseignants-empty">

            <div className="enseignants-empty-icon">
              ◌
            </div>

            <strong>Aucun enseignant</strong>

            <span>
              Aucun enseignant n'est actuellement disponible.
            </span>

          </div>
        ) : (
          <table className="enseignants-table">

            <thead>
              <tr>
                <th>Matricule</th>
                <th>Enseignant</th>
                <th>Contact</th>
              </tr>
            </thead>

            <tbody>

              {enseignants.map((ens) => (
                <tr key={ens.id_enseignant}>

                  {/* MATRICULE */}
                  <td>
                    <span className="matricule-badge">
                      {ens.matricule}
                    </span>
                  </td>

                  {/* NOM */}
                  <td>
                    <div className="enseignant-name">

                      <div className="enseignant-avatar">
                        {ens.nom
                          ?.charAt(0)
                          ?.toUpperCase() || "E"}
                      </div>

                      <div className="enseignant-name-content">

                        <strong>
                          {ens.titre}. {ens.nom}
                        </strong>

                        <span>
                          Enseignant
                        </span>

                      </div>

                    </div>
                  </td>

                  {/* CONTACT */}
                  <td>
                    <div className="enseignant-contact">

                      {ens.email && (
                        <span className="contact-line">
                          <span className="contact-icon">
                            @
                          </span>
                          {ens.email}
                        </span>
                      )}

                      {ens.telephone && (
                        <span className="contact-line">
                          <span className="contact-icon">
                            #
                          </span>
                          {ens.telephone}
                        </span>
                      )}

                      {!ens.email && !ens.telephone && (
                        <span className="contact-empty">
                          Aucun contact
                        </span>
                      )}

                    </div>
                  </td>

                </tr>
              ))}

            </tbody>

          </table>
        )}

      </div>

    </div>
  );
};

export default ListeEnseignants;

