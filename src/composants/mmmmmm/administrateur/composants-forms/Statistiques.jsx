import React, { useState } from "react";
import "../../../styles-pages/administrateur/composants-Styles/Statistiques.css";

const Card = ({ title }) => {
  const [showNames, setShowNames] = useState(null);
  const [deliberation, setDeliberation] = useState(false);
  const [saisieOuverte, setSaisieOuverte] = useState(false);

  const handleClick = (subject) => {
    setShowNames(showNames === subject ? null : subject);
  };

  return (
    <div className="card">
      <h2 className="card-title">{title}</h2>

      <div className="subjects">
        <div className="subject" onClick={() => handleClick("maths")}>
          Mathématiques
        </div>
        {showNames === "maths" && (
          <div className="names-box">
            <p>Jean</p>
            <p>Marie</p>
            <p>Paul</p>
            <button className="btn">OK</button>
          </div>
        )}

        <div className="subject" onClick={() => handleClick("francais")}>
          Français
        </div>
        {showNames === "francais" && (
          <div className="names-box">
            <p>Alice</p>
            <p>Luc</p>
            <p>Sarah</p>
            <button className="btn">OK</button>
          </div>
        )}
      </div>

      <button
        className={`btn ${deliberation ? "btn-active" : ""}`}
        onClick={() => setDeliberation(!deliberation)}
      >
        {deliberation ? "Délibération en cours" : "Lancer délibération"}
      </button>

      <button
        className={`btn ${saisieOuverte ? "btn-active" : ""}`}
        onClick={() => setSaisieOuverte(!saisieOuverte)}
      >
        {saisieOuverte ? "Fermer la saisie des côtes" : "Ouvrir la saisie des côtes"}
      </button>
    </div>
  );
};

const Statistiques = () => {
  return (
    <div className="cards-container">
      <Card title="L1" />
      <Card title="L2" />
      <Card title="L3" />
    </div>
  );
};

export default Statistiques;
