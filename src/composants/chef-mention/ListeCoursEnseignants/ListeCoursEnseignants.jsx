import React, { useState, useEffect } from "react";
import "./ListeCoursEnseignants.css";
import { getAffectationsCoursByMention } from "./listeCoursService";

const ListeCoursEnseignants = ({ code_mention }) => {
  const [liste, setListe] = useState([]);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [loading, setLoading] = useState(true);
  const [anneeAcademique, setAnneeAcademique] = useState("");


  const showMessage = (msg, type = "success") => {
    setMessage(msg);
    setMessageType(type);

    setTimeout(() => {
      setMessage("");
      setMessageType("");
    }, 4000);
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);

      const result = await getAffectationsCoursByMention({ code_mention });

      if (result.success) {

        setListe(result.data);
        setAnneeAcademique(result.annee_academique);

        if (result.data.length === 0) {
          showMessage(
            "Aucune affectation trouvée pour cette mention.",
            "error"
          );
        }

      } else {

        setListe([]);
        showMessage(result.message, "error");
      }

      setLoading(false);
    };

    if (code_mention) {
      loadData();
    }

  }, [code_mention]);

  if (loading) {
    return (
      <div className="liste-dropdown">
        Chargement...
      </div>
    );
  }


  const enseignants = {};

  liste.forEach((item) => {
    const enseignant = item.nom_enseignant;

    if (!enseignants[enseignant]) {
      enseignants[enseignant] = {
        titre: item.titre,
        promotions: {},
      };
    }

    const promotionSemestre =
      `${item.nom_promotion} — ${item.semestre}`;

    if (!enseignants[enseignant].promotions[promotionSemestre]) {
      enseignants[enseignant].promotions[promotionSemestre] = [];
    }

    enseignants[enseignant].promotions[promotionSemestre].push(
      item.nom_cours
    );
  });

  return (
    <div className="liste-dropdown fade-in">
      <h2>
          Affectations des cours pour l'année académique en cours
      </h2>

      {message && (
        <div className={`notification ${messageType}`}>
          {message}
        </div>
      )}

      <div className="liste-scrollable">

          {Object.keys(enseignants).length > 0 ? (

              Object.entries(enseignants).map(([enseignant, data]) => (

                  <div
                      className="enseignant-card"
                      key={enseignant}
                  >

                      <div className="enseignant-header">
                          {data.titre}. {enseignant}
                      </div>

                      {Object.entries(data.promotions).map(
                          ([promotion, cours]) => (

                              <div
                                  className="promotion-block"
                                  key={promotion}
                              >

                                  <div className="promotion-title">
                                      📘 {promotion}
                                  </div>

                                  <ul className="cours-list">

                                      {cours.map((coursItem, index) => (

                                          <li key={index}>
                                              {coursItem}
                                          </li>

                                      ))}

                                  </ul>

                              </div>

                          )
                      )}

                  </div>

              ))

          ) : (

              <div className="empty-list">
                  Aucune donnée disponible.
              </div>

          )}

      </div>

      <button className="download-btn">
        📥 Télécharger la liste
      </button>
    </div>
  );
};

export default ListeCoursEnseignants;
