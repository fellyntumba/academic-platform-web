import React, { useState, useEffect } from "react";
import "./ListeEnseignants.css";

import { getEnseignantsStatsService } from "./listeEnseService"; 
// 👉 adapte le chemin selon ton projet

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

      <div className="liste-header">

        <div>
          <h2>Liste des enseignants</h2>
          <p>{enseignants.length} enseignant(s)</p>
        </div>

        <button className="download-btn">
          Télécharger
        </button>

      </div>

      <div className="liste-scrollable">

        {loading ? (
          <p>Chargement des enseignants...</p>
        ) : (
          <table className="enseignants-table">

            <thead>
              <tr>
                <th>Matricule</th>
                <th>Nom complet</th>
                <th>Email/tél.</th>
                
              </tr>
            </thead>

            <tbody>
              {enseignants.map((ens) => (
                <tr key={ens.id_enseignant}>

                  <td>{ens.matricule}</td>

                  <td>{ens.titre}. {ens.nom}</td>

                  <td>{ens.email} || {ens.telephone}</td>


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
