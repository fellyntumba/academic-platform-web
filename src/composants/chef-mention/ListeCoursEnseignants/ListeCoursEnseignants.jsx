import React, { useState, useEffect } from "react";
import "./ListeCoursEnseignants.css";
import { getCoursFaculteAnneeActiveService } from "./listeCoursService";

const ListeCoursEnseignants = ({ nomFaculte }) => {
  const [liste, setListe] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await getCoursFaculteAnneeActiveService(nomFaculte);
        setListe(data);
      } catch (error) {
        setMessage("❌ Impossible de charger les données.");
      } finally {
        setLoading(false); 
      }
    };
      
    if (nomFaculte) {
      loadData();
    }
  }, [nomFaculte]);

  if (loading) {
    return <div className="liste-dropdown">Chargement...</div>;
  }

  return (
    <div className="liste-dropdown fade-in">
      <h2>Liste des enseignants et leurs cours</h2>

      {message && <div className="error-message">{message}</div>}

      <div className="liste-scrollable">
        <table className="liste-table">
          <thead>
            <tr>
              <th>Cours</th>
              <th>Enseignant</th>
              <th>Promotion</th>
              <th>Semestre</th>
              <th>Année Académique</th>
            </tr>
          </thead>
          <tbody>
            {liste.length > 0 ? (
              liste.map((row, idx) => (
                <tr key={idx}>
                  <td>{row.cours}</td>
                  <td>{row.enseignant || "Non affecté"}</td>
                  <td>{row.promotion}</td>
                  <td>{row.semestre}</td>
                  <td>{row.annee_academique}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">Aucune donnée disponible.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <button className="download-btn">
        📥 Télécharger la liste
      </button>
    </div>
  );
};

export default ListeCoursEnseignants;
